import { useId, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import './gallery.css';

// A tabbed media viewer: the demo video first, then screenshots.
// Tabs follow the WAI-ARIA tabs pattern (arrow keys, Home, End).
export default function ProjectGallery({ media, name }) {
  const items = [
    ...(media.video ? [{ kind: 'video', label: 'Demo', ...media.video }] : []),
    ...media.shots.map((shot) => ({ kind: 'image', ...shot })),
  ];
  const [index, setIndex] = useState(0);
  const tabs = useRef([]);
  const base = useId();
  const current = items[index];
  const tabbed = items.length > 1;

  const select = (next, focus) => {
    const i = (next + items.length) % items.length;
    setIndex(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKeyDown = (event) => {
    const keys = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 };
    if (event.key in keys) {
      event.preventDefault();
      select(keys[event.key], true);
    }
  };

  return (
    <div className="gallery">
      <div
        className="gallery-stage"
        {...(tabbed ? { role: 'tabpanel', id: `${base}-panel`, 'aria-labelledby': `${base}-tab-${index}` } : {})}
      >
        {current.kind === 'video' ? (
          <video
            key={current.src}
            className="gallery-media"
            src={current.src}
            poster={current.poster}
            controls
            playsInline
            preload="none"
            width="1440"
            height="900"
            aria-label={current.alt}
          />
        ) : (
          <img
            key={current.src}
            className={`gallery-media${current.fit === 'contain' ? ' gallery-media--contain' : ''}`}
            src={current.src}
            alt={current.alt}
            width={current.width ?? 1600}
            height={current.height ?? 1000}
            decoding="async"
          />
        )}
      </div>
      {current.caption ? <p className="gallery-caption">{current.caption}</p> : null}

      {/* With a single item (just the video) there is nothing to switch between. */}
      {tabbed ? <div className="gallery-tabs" role="tablist" aria-label={`${name} demo and screenshots`} onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.src}
            ref={(node) => { tabs.current[i] = node; }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${base}-panel`}
            tabIndex={i === index ? 0 : -1}
            className="gallery-tab"
            onClick={() => select(i)}
          >
            <span className="gallery-thumb">
              <img src={item.kind === 'video' ? item.poster : item.src} alt="" width="160" height="100" loading="lazy" decoding="async" />
              {item.kind === 'video' ? <Play className="gallery-play" size={16} strokeWidth={2.4} aria-hidden="true" /> : null}
            </span>
            <span className="gallery-label">{item.label}</span>
          </button>
        ))}
      </div> : null}
    </div>
  );
}
