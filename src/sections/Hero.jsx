import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { profile } from '../data/profile.js';
import { useGithubActivity } from '../lib/useGithubActivity.js';
import OutLink from '../components/OutLink.jsx';
import { gsap, prefersReducedMotion, scrollToTarget, useGSAP } from '../motion/gsap.js';
import { timeAgo } from '../lib/time.js';
import './hero.css';

export default function Hero() {
  const ref = useRef(null);
  const latest = useGithubActivity().recent[0];

  // The page's one orchestrated entrance: the name rises out of its line
  // masks while the orbit draws around it (FlightSystem), then the rest settles.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-line-inner', { yPercent: 105, duration: 1.3, stagger: 0.12 }, 0.1)
        .from('.hero-intro > *', { autoAlpha: 0, y: 18, duration: 0.9, stagger: 0.08 }, 0.7)
        .from('.telemetry-row', { autoAlpha: 0, x: 12, duration: 0.7, stagger: 0.07 }, 0.9);
    },
    { scope: ref },
  );

  return (
    <section className="hero" id="top" data-hero ref={ref} aria-labelledby="hero-title">
      <div className="hero-inner wrap">
        <h1 className="hero-name" id="hero-title" data-orbit-anchor>
          <span className="hero-line">
            <span className="hero-line-inner">{profile.firstName}</span>
          </span>
          <span className="hero-line hero-line--offset">
            <span className="hero-line-inner">{profile.lastName}</span>
          </span>
        </h1>

        <div className="hero-foot">
          <div className="hero-intro">
            <p className="hero-summary">{profile.summary}</p>
            <p className="hero-detail">{profile.detail}</p>
            <div className="hero-actions">
              <a
                className="button button--primary"
                href="#work"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToTarget('#work');
                }}
              >
                See the work
                <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a className="button" href={profile.resume} target="_blank" rel="noopener">
                Résumé (PDF)
              </a>
            </div>
            <ul className="hero-social" aria-label="Elsewhere">
              <li><OutLink href={profile.links.github}>GitHub</OutLink></li>
              <li><OutLink href={profile.links.linkedin}>LinkedIn</OutLink></li>
              <li><OutLink href={profile.links.leetcode}>LeetCode</OutLink></li>
              <li><a className="link" href={`mailto:${profile.email}`}>Email</a></li>
            </ul>
          </div>

          <dl className="telemetry" aria-label="Current status">
            <div className="telemetry-row">
              <dt>Position</dt>
              <dd className="data">
                {profile.location.city}, {profile.location.country}
              </dd>
            </div>
            <div className="telemetry-row">
              <dt>Studying</dt>
              <dd className="data">Scaler School of Technology, class of 2028</dd>
            </div>
            <div className="telemetry-row">
              <dt>LeetCode streak</dt>
              <dd className="data">{profile.leetcode.streakDays}+ days</dd>
            </div>
            {latest ? (
              <div className="telemetry-row">
                <dt>Last push</dt>
                <dd className="data">
                  <a href={latest.url} target="_blank" rel="noopener noreferrer">
                    {latest.name.replaceAll('_', ' ')}
                  </a>
                  , {timeAgo(latest.pushedAt)}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </div>
    </section>
  );
}
