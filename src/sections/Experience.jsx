import { building } from '../data/experience.js';
import SectionHead from '../components/SectionHead.jsx';
import OutLink from '../components/OutLink.jsx';
import './experience.css';

export default function Experience() {
  return (
    <section className="section experience" id="experience" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead id="experience" title="Experience" />

        <article className="exp-item" aria-labelledby="exp-bricks">
          <div className="exp-id">
            <h3 className="exp-org" id="exp-bricks">
              {building.org}
            </h3>
            <p className="exp-role">{building.role}</p>
            <p className="exp-dates data">
              {building.dates}, {building.place}
            </p>
          </div>
          <div className="exp-detail">
            <ul className="exp-points">
              {building.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <OutLink href={building.source}>Platform source code</OutLink>
          </div>
        </article>
      </div>
    </section>
  );
}
