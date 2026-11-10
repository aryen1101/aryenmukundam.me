import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The single Lenis instance, shared so navigation can scroll through it.
let lenisInstance = null;
export const setLenis = (lenis) => {
  lenisInstance = lenis;
};
export const getLenis = () => lenisInstance;

export function scrollToTarget(target) {
  const lenis = getLenis();
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  if (lenis) {
    lenis.scrollTo(element, { offset: target === '#top' ? 0 : -16 });
  } else {
    element.scrollIntoView({ block: 'start' });
  }
}

export { gsap, ScrollTrigger, useGSAP };
