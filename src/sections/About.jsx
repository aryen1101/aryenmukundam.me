import portrait from '../assets/portrait.webp';
import SectionHead from '../components/SectionHead.jsx';
import './about.css';

export default function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about" title="About" />
        <div className="about-grid">
          <figure className="about-portrait">
            <img src={portrait} alt="Aryen Mukundam at night in Bengaluru" width="631" height="734" loading="lazy" decoding="async" />
          </figure>
          <div className="about-copy">
            <p className="about-lead">
              I’m Aryen, a computer science student at Scaler School of Technology and BITS Pilani, based in Bengaluru. I like
              the moment a vague problem turns into a system with clear moving parts.
            </p>
            <p>
              Most of what I build sits where AI meets ordinary engineering: retrieval pipelines that check their own answers, a
              code reviewer that learns a team’s conventions, and the backends and interfaces that make them usable. Before
              that, I co-founded Bricks Education and built the platform its classes ran on.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
