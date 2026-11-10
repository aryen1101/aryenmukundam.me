import { useRef } from 'react';
import { gsap, prefersReducedMotion, useGSAP } from '../motion/gsap.js';
import './pipeline.css';

/*
  An architecture diagram drawn from the project's real pipeline.
  When it scrolls into view a signal travels down each lane, lighting every
  stage as it passes. Hovering or focusing the diagram sends it again.
*/
export default function Pipeline({ lanes, label }) {
  const ref = useRef(null);
  const timeline = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: ref.current, start: 'top 72%', once: true, onEnter: () => tl.play(0) },
      });

      ref.current.querySelectorAll('.lane').forEach((lane, laneIndex) => {
        const spine = lane.querySelector('.lane-spine');
        const packet = lane.querySelector('.lane-packet');
        const nodes = lane.querySelectorAll('.step-node');
        const steps = lane.querySelectorAll('.step');
        const height = spine.offsetHeight;
        const duration = 0.32 * nodes.length;
        const at = laneIndex * 0.25;

        tl.fromTo(spine, { scaleY: 0 }, { scaleY: 1, duration, ease: 'power1.inOut' }, at)
          .set(packet, { autoAlpha: 1 }, at)
          .fromTo(packet, { y: 0 }, { y: height, duration, ease: 'power1.inOut' }, at)
          .to(packet, { autoAlpha: 0, duration: 0.25 }, at + duration);

        nodes.forEach((node, i) => {
          // Steps are positioned within the track, so offsetTop maps straight onto the spine.
          const when = at + (duration * Math.max(0, steps[i].offsetTop + 4)) / Math.max(height, 1);
          tl.fromTo(node, { backgroundColor: 'rgba(11,28,59,1)' }, { backgroundColor: '#f4b43c', duration: 0.18 }, when);
          tl.fromTo(steps[i], { opacity: 0.35 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, when - 0.08);
        });
      });

      timeline.current = tl;
    },
    { scope: ref },
  );

  const replay = () => {
    const tl = timeline.current;
    if (tl && !tl.isActive() && tl.progress() === 1) tl.play(0);
  };

  return (
    <figure className="pipeline" ref={ref} onPointerEnter={replay} data-lanes={lanes.length}>
      <figcaption className="visually-hidden">{label}</figcaption>
      {lanes.map((lane) => (
        <div className="lane" key={lane.label}>
          <p className="lane-label">{lane.label}</p>
          <div className="lane-track">
            <span className="lane-spine" aria-hidden="true" />
            <span className="lane-packet" aria-hidden="true" />
            <ol className="lane-steps">
              {lane.steps.map((step) => (
                <li className="step" key={step.title}>
                  <span className="step-node" aria-hidden="true" />
                  <span className="step-title">{step.title}</span>
                  {step.note ? <span className="step-note data">{step.note}</span> : null}
                  {step.branches ? (
                    <ul className="step-branches" aria-label={`${step.branches.length} parallel paths`}>
                      {step.branches.map((branch, i) => (
                        <li className="data" key={`${branch}-${i}`}>
                          {branch}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </figure>
  );
}
