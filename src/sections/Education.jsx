import { studying } from '../data/experience.js';
import SectionHead from '../components/SectionHead.jsx';
import './experience.css';

export default function Education() {
  return (
    <section className="section education" id="education" aria-labelledby="education-title">
      <div className="wrap">
        <SectionHead id="education" title="Education">
          <p>Two computer science degrees, studied in parallel since August 2024.</p>
        </SectionHead>

        <ul className="edu-list">
          {studying.map((school) => (
            <li key={school.org}>
              <h3 className="exp-org exp-org--small">{school.org}</h3>
              <p className="exp-role">{school.course}</p>
              <p className="exp-dates data">
                {school.dates}, {school.place}
              </p>
              <p className="edu-grade data">{school.grade}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
