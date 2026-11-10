// The satellite from the original site, redrawn in the blueprint palette:
// paper body, gold-foil solar panels, ink linework. It points along +x.
export default function Satellite({ className }) {
  return (
    <svg className={className} viewBox="0 0 76 42" aria-hidden="true" focusable="false">
      <path className="sat-panel" d="M26 15 8 7.5v11L26 21Z" />
      <path className="sat-panel" d="M26 27 8 34.5v-11L26 21Z" />
      <path className="sat-panel-line" d="M14 10v10M20 12.5v8M14 22v10M20 21.5v8" />
      <rect className="sat-body" x="25" y="12" width="28" height="18" rx="4" />
      <path className="sat-antenna" d="m53 16 11-7M53 26l11 7" />
      <circle className="sat-dish" cx="66" cy="8" r="2.4" />
      <circle className="sat-dish" cx="66" cy="34" r="2.4" />
      <circle className="sat-light" cx="44" cy="21" r="3" />
    </svg>
  );
}
