import { ArrowUpRight } from 'lucide-react';

// External link: opens in a new tab and says so to screen readers.
export default function OutLink({ href, children, className = 'link', icon = true }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      {icon ? <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /> : null}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
