import { useState } from 'react';
import { skillGroups, skillProjects } from '../data/skills.js';
import SectionHead from '../components/SectionHead.jsx';
import './stack.css';

function SkillList({ items, focus, variant }) {
  if (!items.length) return null;
  return (
    <ul className={`skills skills--${variant}`}>
      {items.map((skill) => {
        const match = focus ? skill.in?.includes(focus) : null;
        return (
          <li key={skill.name} data-match={match === null ? undefined : String(Boolean(match))}>
            {skill.name}
          </li>
        );
      })}
    </ul>
  );
}

export default function Stack() {
  const [focus, setFocus] = useState(null);
  const focusLabel = skillProjects.find((p) => p.id === focus)?.label;

  return (
    <section className="section stack" id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHead id="stack" title="What I work with">
          <p>Split by what I have shipped in a project and what I am still learning. Pick a project to see its stack.</p>
        </SectionHead>

        <div className="stack-filter" role="group" aria-label="Highlight the stack of one project">
          <button type="button" aria-pressed={focus === null} onClick={() => setFocus(null)}>
            Everything
          </button>
          {skillProjects.map((p) => (
            <button key={p.id} type="button" aria-pressed={focus === p.id} onClick={() => setFocus(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        <p className="visually-hidden" aria-live="polite">
          {focusLabel ? `Highlighting skills used in ${focusLabel}.` : 'Showing every skill.'}
        </p>

        <div className={`stack-table${focus ? ' is-focused' : ''}`}>
          <div className="stack-row stack-row--head" aria-hidden="true">
            <span />
            <span>Built with</span>
            <span>Exploring</span>
          </div>
          {skillGroups.map((group) => (
            <div className="stack-row" key={group.name}>
              <h3>{group.name}</h3>
              <div>
                <span className="stack-col-label">Built with</span>
                <SkillList items={group.used} focus={focus} variant="used" />
              </div>
              <div>
                {group.exploring.length ? <span className="stack-col-label">Exploring</span> : null}
                <SkillList items={group.exploring} focus={focus} variant="exploring" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
