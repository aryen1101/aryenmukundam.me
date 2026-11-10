import './section-head.css';

// A section heading with its waypoint: the ring the satellite's route passes
// through. The ring lights in foil once the satellite reaches it.
export default function SectionHead({ id, title, children, tone }) {
  return (
    <header className={`section-head${tone ? ` section-head--${tone}` : ''}`}>
      <h2 id={`${id}-title`} className="section-title">
        <span className="waypoint" data-waypoint={id} aria-hidden="true" />
        {title}
      </h2>
      {children ? <div className="section-lede">{children}</div> : null}
    </header>
  );
}
