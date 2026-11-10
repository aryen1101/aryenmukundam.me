import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems, profile } from '../data/profile.js';
import { scrollToTarget } from '../motion/gsap.js';
import './nav.css';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  // The satellite reports which waypoint it has reached.
  useEffect(() => {
    const onSection = (event) => setActive(event.detail);
    window.addEventListener('flight:section', onSection);
    return () => window.removeEventListener('flight:section', onSection);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (event, hash) => {
    event.preventDefault();
    setOpen(false);
    scrollToTarget(hash);
    history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
  };

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav-bar wrap">
        <a className="nav-name" href="#top" onClick={(e) => go(e, '#top')}>
          {profile.name}
        </a>

        <nav className="nav-links" aria-label="Sections">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              onClick={(e) => go(e, `#${item.id}`)}
            >
              {item.label}
            </a>
          ))}
          <a className="nav-resume" href={profile.resume} target="_blank" rel="noopener">
            Résumé
          </a>
        </nav>

        <button
          ref={toggleRef}
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-panel"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div className="nav-progress" aria-hidden="true">
        <span data-flight-progress />
      </div>

      <div id="nav-panel" className="nav-panel" ref={panelRef} hidden={!open}>
        <nav className="wrap" aria-label="Sections">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              onClick={(e) => go(e, `#${item.id}`)}
            >
              {item.label}
            </a>
          ))}
          <a href={profile.resume} target="_blank" rel="noopener">
            Résumé (PDF)
          </a>
        </nav>
      </div>
    </header>
  );
}
