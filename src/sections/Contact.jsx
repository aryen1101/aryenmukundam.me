import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { profile } from '../data/profile.js';
import SectionHead from '../components/SectionHead.jsx';
import OutLink from '../components/OutLink.jsx';
import './contact.css';

export default function Contact() {
  const [copied, setCopied] = useState(null); // null | 'ok' | 'failed'
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied('ok');
    } catch {
      setCopied('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2200);
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead id="contact" title="Get in touch" tone="foil">
          <p>
            If you are building in AI tooling, backend systems or education, or hiring for any of them, I would like to hear
            about it. Email reaches me fastest.
          </p>
        </SectionHead>

        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>

        <div className="contact-actions">
          <a className="button contact-button--solid" href={`mailto:${profile.email}`}>
            Write an email
          </a>
          <button className="button contact-button" type="button" onClick={copy}>
            {copied === 'ok' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            {copied === 'ok' ? 'Address copied' : 'Copy address'}
          </button>
          <span className="contact-status" role="status">
            {copied === 'failed' ? 'Copying is blocked here. Select the address above instead.' : ''}
          </span>
        </div>

        <ul className="contact-links">
          <li><OutLink href={profile.links.github}>GitHub</OutLink></li>
          <li><OutLink href={profile.links.linkedin}>LinkedIn</OutLink></li>
          <li><OutLink href={profile.links.leetcode}>LeetCode</OutLink></li>
          <li><OutLink href={profile.resume}>Résumé (PDF)</OutLink></li>
        </ul>
      </div>
    </section>
  );
}
