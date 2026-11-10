import { useMemo, useRef } from 'react';
import { profile } from '../data/profile.js';
import SectionHead from '../components/SectionHead.jsx';
import OutLink from '../components/OutLink.jsx';
import { gsap, prefersReducedMotion, useGSAP } from '../motion/gsap.js';
import './practice.css';

export default function Practice() {
  const ref = useRef(null);
  const days = profile.leetcode.streakDays;
  const cells = useMemo(() => Array.from({ length: days }, (_, i) => i), [days]);

  // The streak fills in, day by day, as it scrolls past.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '.streak-grid i',
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: 'none',
          stagger: { each: 1 / days },
          scrollTrigger: { trigger: '.streak-grid', start: 'top 85%', end: 'bottom 55%', scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section className="section practice" id="practice" aria-labelledby="practice-title">
      <div className="wrap" ref={ref}>
        <SectionHead id="practice" title="Practice">
          <p>Data structures and algorithms, every day. Solutions are written in Java and kept on GitHub.</p>
        </SectionHead>

        <div className="streak">
          <div className="streak-side">
            <dl className="streak-figures">
              <div>
                <dt>problems solved on LeetCode</dt>
                <dd>{profile.leetcode.solved}</dd>
              </div>
              <div>
                <dt>day solving streak</dt>
                <dd>{days}+</dd>
              </div>
            </dl>
            <div className="plate-links">
              <OutLink href={profile.links.leetcode}>LeetCode profile</OutLink>
              <OutLink href={profile.leetcode.repo}>Solutions in Java</OutLink>
            </div>
          </div>
          <figure className="streak-chart">
            <div className="streak-grid" role="img" aria-label={`${days} squares, one for each day of the streak`}>
              {cells.map((i) => (
                <i key={i} />
              ))}
            </div>
            <figcaption>Each square is one day with at least one problem solved.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
