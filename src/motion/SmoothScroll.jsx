import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion, setLenis } from './gsap.js';

// Lenis drives scrolling from GSAP's ticker, so ScrollTrigger and the
// satellite read the same scroll position on the same frame.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false, anchors: false });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
