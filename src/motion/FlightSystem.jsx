import { useEffect, useRef } from 'react';
import Satellite from './Satellite.jsx';
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap.js';
import './flight.css';

/*
  The satellite's flight.

  1. In the hero it orbits the name on a tilted ellipse, passing behind the
     letters on the far side. The orbit leans toward the pointer.
  2. As you scroll out of the hero it leaves orbit and joins a route that is
     built from the real positions of each section's waypoint marker, so it
     always passes through every section heading.
  3. Its position on the route is tied to the middle of the viewport. The
     route behind it is drawn in foil; each waypoint lights as it passes and
     tells the navigation which section you are in.

  Everything is computed from layout (ResizeObserver), and per-frame work is
  a lookup-table read plus one transform write.
*/

const ORBIT_SECONDS = 20;
const BASE_TILT = -9; // degrees
const LUT_STEP = 6; // px of path length between samples
const MOBILE = 760;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const lerpAngle = (a, b, t) => {
  let diff = ((b - a + 540) % 360) - 180;
  return a + diff * t;
};

// Smooth curve through every point (Catmull-Rom converted to cubic Béziers).
// Returns the SVG path and the segments, so the route can be sampled in JS.
function curveThrough(points) {
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  const segments = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    // A point marked `v` leaves and arrives vertically, with handles sized to its own
    // segment, so the curve never overshoots sideways or doubles back in y.
    const c1 = p1.v ? { x: p1.x, y: p1.y + (p2.y - p1.y) / 3 } : { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = p2.v ? { x: p2.x, y: p2.y - (p2.y - p1.y) / 3 } : { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    segments.push([p1, c1, c2, p2]);
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return { d, segments };
}

/*
  Samples the route at an even spacing along its length, using plain Bézier
  maths. (The browser's getPointAtLength is far too slow for this: thousands
  of calls on a page-long path took seconds and caused the start-up lag.)
*/
function sampleRoute(segments, step) {
  // 1. Dense polyline with cumulative length.
  const px = [];
  const py = [];
  const acc = [];
  let total = 0;
  for (const [p1, c1, c2, p2] of segments) {
    const approx = Math.hypot(c1.x - p1.x, c1.y - p1.y) + Math.hypot(c2.x - c1.x, c2.y - c1.y) + Math.hypot(p2.x - c2.x, p2.y - c2.y);
    const n = Math.min(400, Math.max(16, Math.ceil(approx / 3)));
    for (let k = px.length ? 1 : 0; k <= n; k += 1) {
      const t = k / n;
      const u = 1 - t;
      const a = u * u * u;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const e = t * t * t;
      const x = a * p1.x + b * c1.x + c * c2.x + e * p2.x;
      const y = a * p1.y + b * c1.y + c * c2.y + e * p2.y;
      if (px.length) total += Math.hypot(x - px[px.length - 1], y - py[py.length - 1]);
      px.push(x);
      py.push(y);
      acc.push(total);
    }
  }

  // 2. Resample at an even step along that length.
  const count = Math.ceil(total / step) + 1;
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  const ysMono = new Float32Array(count);
  let j = 0;
  let max = -Infinity;
  for (let i = 0; i < count; i += 1) {
    const target = Math.min(total, i * step);
    while (j < acc.length - 2 && acc[j + 1] < target) j += 1;
    const span = acc[j + 1] - acc[j] || 1;
    const t = Math.min(1, Math.max(0, (target - acc[j]) / span));
    xs[i] = px[j] + (px[j + 1] - px[j]) * t;
    ys[i] = py[j] + (py[j + 1] - py[j]) * t;
    max = Math.max(max, ys[i]);
    ysMono[i] = max;
  }
  return { total: total || 1, xs, ys, ysMono };
}

export default function FlightSystem() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const main = root.parentElement;
    const svg = root.querySelector('.flight-svg');
    const ahead = root.querySelector('.route-ahead');
    const trail = root.querySelector('.route-trail');
    const ring = root.querySelector('.orbit-ring');
    const craft = root.querySelector('.craft');
    const reduced = prefersReducedMotion();

    const s = {
      ready: false,
      total: 1,
      xs: null,
      ys: null,
      ysMono: null,
      waypoints: [], // { el, id, len, lit }
      orbit: { cx: 0, cy: 0, rx: 1, ry: 1 },
      heroH: 1,
      mainTop: 0,
      cur: 0,
      angle: Math.PI * 0.18,
      tilt: BASE_TILT,
      tiltTarget: BASE_TILT,
      behind: null,
      activeId: null,
    };

    const pointAt = (len) => {
      const f = clamp01(len / s.total) * (s.xs.length - 1);
      const i = Math.floor(f);
      const j = Math.min(s.xs.length - 1, i + 1);
      const t = f - i;
      const x = lerp(s.xs[i], s.xs[j], t);
      const y = lerp(s.ys[i], s.ys[j], t);
      const k0 = Math.max(0, i - 2);
      const k1 = Math.min(s.xs.length - 1, i + 3);
      const deg = (Math.atan2(s.ys[k1] - s.ys[k0], s.xs[k1] - s.xs[k0]) * 180) / Math.PI;
      return { x, y, deg };
    };

    const lengthAtY = (y) => {
      const ys = s.ysMono;
      if (y <= ys[0]) return 0;
      if (y >= ys[ys.length - 1]) return s.total;
      let lo = 0;
      let hi = ys.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid;
        else hi = mid;
      }
      const span = ys[hi] - ys[lo] || 1;
      return Math.min(s.total, (lo + (y - ys[lo]) / span) * LUT_STEP);
    };

    function layout() {
      const mainRect = main.getBoundingClientRect();
      const w = main.clientWidth;
      // offsetHeight, not scrollHeight: scrollHeight includes this SVG and would feed back into itself.
      const h = main.offsetHeight;
      s.mainTop = mainRect.top + window.scrollY;

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);

      const rel = (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - mainRect.left + r.width / 2, y: r.top - mainRect.top + r.height / 2, w: r.width, h: r.height };
      };

      const anchor = main.querySelector('[data-orbit-anchor]');
      const hero = main.querySelector('[data-hero]');
      if (!anchor || !hero) return;
      const a = rel(anchor);
      const mobile = w < MOBILE;
      // The orbit leans right of the name so it also spans the open side of the hero.
      s.orbit = {
        cx: a.x + a.w * (mobile ? 0.04 : 0.1),
        cy: a.y,
        rx: 0,
        ry: Math.max(a.h * 0.6, 60),
      };
      // Keep the whole orbit on screen instead of clipping it at the page edge.
      s.orbit.rx = Math.min(a.w * (mobile ? 0.62 : 0.68), w * 0.47, s.orbit.cx - 12, w - s.orbit.cx - 12);
      ring.setAttribute('cx', s.orbit.cx);
      ring.setAttribute('cy', s.orbit.cy);
      ring.setAttribute('rx', s.orbit.rx);
      ring.setAttribute('ry', s.orbit.ry);
      s.heroH = hero.offsetHeight;

      // Route: a full-width zigzag, as in the original site. From the hero it dives
      // from the right margin to the first waypoint (left), then between each pair of
      // waypoints it sweeps diagonally out to the right margin and back to the left.
      // Each turn sits midway between waypoints, so every diagonal is spread over
      // half a section of scrolling rather than crossed in one tick.
      const wrap = main.querySelector('.wrap');
      const margin = wrap ? (w - wrap.clientWidth) / 2 : 24;
      const farX = w - Math.max(margin * 0.5, 14);
      const els = [...main.querySelectorAll('[data-waypoint]')];
      const wps = els.map((el) => ({ el, id: el.dataset.waypoint, ...rel(el) }));
      // `v` points leave and arrive vertically, which turns each leg into a smooth
      // S-curve that never doubles back in y.
      const points = [{ x: farX, y: s.heroH * 0.86, v: true }];
      wps.forEach((wp, i) => {
        points.push({ x: wp.x, y: wp.y, v: true });
        const next = wps[i + 1];
        if (next) points.push({ x: farX, y: (wp.y + next.y) / 2, v: true });
      });
      if (points.length < 2) return;

      const { d, segments } = curveThrough(points);
      ahead.setAttribute('d', d);
      trail.setAttribute('d', d);
      Object.assign(s, sampleRoute(segments, LUT_STEP));

      // pathLength makes the browser measure the dash in our units, so the
      // drawn trail lines up exactly with the sampled position.
      trail.setAttribute('pathLength', s.total.toFixed(2));
      trail.style.strokeDasharray = `${s.total} ${s.total}`;
      s.waypoints = wps.map((wp) => ({ el: wp.el, id: wp.id, len: lengthAtY(wp.y), lit: null }));
      s.ready = true;
    }

    function setActive(id) {
      if (id === s.activeId) return;
      s.activeId = id;
      window.dispatchEvent(new CustomEvent('flight:section', { detail: id }));
    }

    function lightWaypoints(len, force) {
      let active = null;
      for (const wp of s.waypoints) {
        const lit = force || len >= wp.len - 4;
        if (lit !== wp.lit) {
          wp.el.classList.toggle('is-lit', lit);
          wp.lit = lit;
        }
        if (len >= wp.len - window.innerHeight * 0.3) active = wp.id;
      }
      setActive(active);
    }

    const progressBars = () => document.querySelectorAll('[data-flight-progress]');

    function render(dtMs) {
      if (!s.ready) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const targetY = scrollY + vh * 0.55 - s.mainTop;
      const targetLen = lengthAtY(targetY);
      const k = 1 - Math.pow(1 - 0.14, dtMs / 16.67);
      s.cur += (targetLen - s.cur) * k;
      if (Math.abs(targetLen - s.cur) < 0.05) s.cur = targetLen;

      s.angle += (dtMs / 1000) * ((Math.PI * 2) / ORBIT_SECONDS);
      s.tilt += (s.tiltTarget - s.tilt) * k * 0.5;

      // Orbit position, rotated by the tilt.
      const { cx, cy, rx, ry } = s.orbit;
      const t = (s.tilt * Math.PI) / 180;
      const cosT = Math.cos(t);
      const sinT = Math.sin(t);
      const lx = rx * Math.cos(s.angle);
      const ly = ry * Math.sin(s.angle);
      const ox = cx + lx * cosT - ly * sinT;
      const oy = cy + lx * sinT + ly * cosT;
      const dx = -rx * Math.sin(s.angle);
      const dy = ry * Math.cos(s.angle);
      const oDeg = (Math.atan2(dx * sinT + dy * cosT, dx * cosT - dy * sinT) * 180) / Math.PI;
      const depth = Math.sin(s.angle); // −1 far side, +1 near side

      // Hand-off from orbit to route over the first half of the hero.
      const e = smooth(clamp01(scrollY / (s.heroH * 0.5)));
      const r = pointAt(s.cur);
      const x = lerp(ox, r.x, e);
      const y = lerp(oy, r.y, e);
      const deg = lerpAngle(oDeg, r.deg, e);
      const scale = lerp(0.84 + 0.16 * depth, 1, e);

      craft.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${deg.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      // In the hero it passes behind the name on the far side of the orbit. Once it
      // leaves the hero it flies over the page, as in the original design; the route
      // line itself stays under the section content.
      const behind = e < 0.5 && depth < 0;
      if (behind !== s.behind) {
        craft.classList.toggle('is-behind', behind);
        s.behind = behind;
      }

      ring.setAttribute('transform', `rotate(${s.tilt.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`);
      ring.style.opacity = String(1 - e);
      trail.style.strokeDashoffset = String(s.total - s.cur);

      const p = s.cur / s.total;
      progressBars().forEach((bar) => bar.style.setProperty('--flight', p.toFixed(4)));
      lightWaypoints(s.cur, false);
    }

    // Reduced motion: a still satellite in orbit, the whole route drawn,
    // every waypoint lit. The navigation still tracks the current section.
    function renderStill() {
      if (!s.ready) return;
      const { cx, cy, rx, ry } = s.orbit;
      const t = (BASE_TILT * Math.PI) / 180;
      const a = Math.PI * 0.18;
      const lx = rx * Math.cos(a);
      const ly = ry * Math.sin(a);
      craft.style.transform = `translate3d(${cx + lx * Math.cos(t) - ly * Math.sin(t)}px, ${cy + lx * Math.sin(t) + ly * Math.cos(t)}px, 0) translate(-50%, -50%) rotate(${BASE_TILT + 70}deg)`;
      ring.setAttribute('transform', `rotate(${BASE_TILT} ${cx} ${cy})`);
      trail.style.strokeDashoffset = '0';
      const len = lengthAtY(window.scrollY + window.innerHeight * 0.55 - s.mainTop);
      lightWaypoints(len, true);
      let active = null;
      for (const wp of s.waypoints) if (len >= wp.len - window.innerHeight * 0.3) active = wp.id;
      setActive(active);
      progressBars().forEach((bar) => bar.style.setProperty('--flight', (len / s.total).toFixed(4)));
    }

    // Re-layout only when the page's size actually changed.
    let layoutFrame = 0;
    let lastSize = '';
    const scheduleLayout = () => {
      cancelAnimationFrame(layoutFrame);
      layoutFrame = requestAnimationFrame(() => {
        const size = `${main.clientWidth}x${main.offsetHeight}`;
        if (size === lastSize) return;
        lastSize = size;
        layout();
        ScrollTrigger.refresh();
        if (reduced) renderStill();
      });
    };

    layout();
    lastSize = `${main.clientWidth}x${main.offsetHeight}`;
    const resizeObserver = new ResizeObserver(scheduleLayout);
    resizeObserver.observe(main);
    document.fonts?.ready.then(scheduleLayout);
    window.addEventListener('load', scheduleLayout, { once: true });

    const cleanups = [];

    if (reduced) {
      root.classList.add('is-still');
      renderStill();
      let frame = 0;
      const onScroll = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(renderStill);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
    } else {
      const tick = (time, deltaTime) => render(Math.min(deltaTime, 64));
      gsap.ticker.add(tick);
      cleanups.push(() => gsap.ticker.remove(tick));

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const onPointer = (event) => {
          const px = event.clientX / window.innerWidth - 0.5;
          const py = event.clientY / window.innerHeight - 0.5;
          s.tiltTarget = BASE_TILT + px * 12 - py * 5;
        };
        window.addEventListener('pointermove', onPointer, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', onPointer));
      }

      // Entrance: the orbit is drawn, then the satellite appears on it.
      const intro = gsap.timeline({ delay: 0.35 });
      intro
        .fromTo(ring, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' })
        .fromTo(craft, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 0.9);
      cleanups.push(() => intro.kill());
    }

    return () => {
      cancelAnimationFrame(layoutFrame);
      resizeObserver.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="flight" ref={rootRef} aria-hidden="true">
      <svg className="flight-svg" focusable="false">
        <ellipse className="orbit-ring" pathLength="1" />
        <path className="route-ahead" />
        <path className="route-trail" />
      </svg>
      <div className="craft">
        <Satellite />
      </div>
    </div>
  );
}
