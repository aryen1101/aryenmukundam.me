import OutLink from './OutLink.jsx';
import Pipeline from './Pipeline.jsx';
import './plate.css';

export default function ProjectPlate({ project, flip }) {
  const { links } = project;
  return (
    <article className={`plate${flip ? ' plate--flip' : ''}`} aria-labelledby={`${project.id}-name`}>
      <header className="plate-head">
        <h3 className="plate-name" id={`${project.id}-name`}>
          {project.name}
        </h3>
        <p className="plate-kind">
          {project.kind}, {project.year}
        </p>
        <p className="plate-pitch">{project.pitch}</p>
      </header>

      <dl className="plate-figures">
        {project.figures.map((figure) => (
          <div key={figure.label}>
            <dt>{figure.label}</dt>
            <dd>{figure.value}</dd>
          </div>
        ))}
      </dl>

      <div className="plate-body">
        <div className="plate-copy">
          <p className="plate-problem">{project.problem}</p>
          <h4 className="plate-subhead">What I built</h4>
          <ul className="plate-built">
            {project.built.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <h4 className="plate-subhead">Stack</h4>
          <ul className="plate-stack">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="plate-links">
            {links.live ? <OutLink href={links.live}>Live demo</OutLink> : null}
            {links.video ? <OutLink href={links.video}>Demo video</OutLink> : null}
            {links.source ? <OutLink href={links.source}>Source code</OutLink> : null}
          </div>
        </div>

        <div className="plate-media">
          <div className="plate-diagram">
            <p className="plate-media-label">How it works</p>
            <Pipeline lanes={project.pipeline} label={`${project.name} architecture`} />
          </div>
          {project.shot ? (
            <figure className="plate-shot">
              <img src={project.shot.src} alt={project.shot.alt} width="1200" height="750" loading="lazy" decoding="async" />
            </figure>
          ) : null}
        </div>
      </div>
    </article>
  );
}
