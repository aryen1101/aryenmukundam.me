import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, BriefcaseBusiness, Code2, Download, ExternalLink, Mail, Menu, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import profileImage from '../image.jpeg';
import 'lenis/dist/lenis.css';
import './styles.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

let activeLenis = null;

function SmoothScroll() {
  const lenisRef = useRef(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || activeLenis) return undefined;
    const lenis = new Lenis({ autoRaf: false, anchors: true, stopInertiaOnNavigate: true, smoothWheel: true, syncTouch: false, gestureOrientation: 'vertical' });
    activeLenis = lenis;
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const refresh = () => ScrollTrigger.refresh();
    const refreshFrame = requestAnimationFrame(refresh);
    window.addEventListener('load', refresh, { once: true });
    return () => {
      cancelAnimationFrame(refreshFrame);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
      lenisRef.current = null;
      ScrollTrigger.refresh();
    };
  }, { scope: lenisRef });
  return null;
}

function ScrollStory() {
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.utils.toArray('.stream-reveal').forEach((element, index) => gsap.fromTo(element, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.75, delay: (index % 3) * 0.06, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 86%', once: true } }));

    const path = document.querySelector('#page-flight-path');
    const svg = path?.ownerSVGElement;
    const plane = document.querySelector('.page-plane');
    if (!path || !svg || !plane) return;

    const placePlane = (progress) => {
      const length = path.getTotalLength();
      const distance = Math.max(0, Math.min(1, progress)) * length;
      const point = path.getPointAtLength(distance);
      const next = path.getPointAtLength(Math.min(length, distance + 2));
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      const planeSize = plane.offsetWidth || 56;
      const x = (point.x / 100) * width - planeSize / 2;
      const y = (point.y / 1000) * height - planeSize / 2;
      const dx = ((next.x - point.x) / 100) * width;
      const dy = ((next.y - point.y) / 1000) * height;
      gsap.set(plane, { x, y, rotation: Math.atan2(dy, dx) * (180 / Math.PI), force3D: true });
    };

    const flightTrigger = ScrollTrigger.create({
      trigger: '#top',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.4,
      onUpdate: (self) => placePlane(self.progress),
      onRefresh: (self) => placePlane(self.progress),
    });
    placePlane(flightTrigger.progress);
  });
  return null;
}

function SatelliteCraft() {
  return <svg className="satellite-craft" viewBox="0 0 72 42" aria-hidden="true">
    <path className="satellite-flame" d="M20 21c-7-5-12-4-17 0 5 1 8 3 12 7-1-3 1-5 5-7Z" />
    <path className="satellite-panel" d="M25 14 10 8v10l15 3Z" />
    <path className="satellite-panel" d="m25 28-15 6V24l15-3Z" />
    <rect className="satellite-body" x="24" y="12" width="27" height="18" rx="4" />
    <path className="satellite-panel-line" d="M16 10v10M16 23v10" />
    <path className="satellite-antenna" d="m51 16 10-7M51 26l10 7" />
    <circle className="satellite-light" cx="43" cy="21" r="3" />
  </svg>;
}

const projects = [
  { number: '01', title: 'NotebookLLM', type: 'AI / Full Stack', description: 'A grounded document intelligence workspace that turns PDFs, text, and CSVs into reliable answers through retrieval, reranking, and answer evaluation.', tech: ['React', 'Node.js', 'Qdrant', 'Groq', 'Gemini'], link: 'https://github.com/aryen1101/Notebook_LLM' },
  { number: '02', title: 'PRHawk', type: 'Developer Tooling', description: 'An AI GitHub pull-request reviewer that surfaces actionable findings, scores change risk, and turns the latest merged PRs into reusable team rules.', tech: ['React', 'TypeScript', 'Octokit', 'MongoDB', 'Groq'], link: 'https://github.com/aryen1101/PRHawk' },
  { number: '03', title: 'Search Typeahead', type: 'Systems / Infrastructure', description: 'A high-throughput search-as-you-type service built around Redis caching, Kafka write-behind, SQLite, and a lightweight trending ranker.', tech: ['TypeScript', 'Redis', 'Kafka', 'SQLite', 'Docker'], link: 'https://github.com/aryen1101/Search_Typeahead' },
  { number: '04', title: 'BRICKS Dashboard', type: 'Product / EdTech', description: 'A production MERN learning-management platform with role-scoped dashboards, secure authentication, and reusable workflows for students and instructors.', tech: ['React', 'Express', 'MongoDB', 'Tailwind'], link: 'https://github.com/aryen1101/Bricks' },
];

const skillGroups = [
  ['Languages', 'JavaScript', 'TypeScript', 'Java', 'Python', 'Rust', 'SQL'],
  ['Build with', 'React', 'Node.js', 'Express', 'Spring Boot', 'React Native', 'Redux Toolkit'],
  ['AI & data', 'LangChain', 'RAG', 'LLM APIs', 'HuggingFace', 'Prompt Engineering'],
  ['Infrastructure', 'MongoDB', 'SQLite', 'Redis', 'Qdrant', 'Docker', 'Vercel', 'Kafka'],
];

const career = [
  { mark: '01', date: 'FEB — OCT 2025', title: 'Co-founder & Full Stack Engineer', place: 'Bricks Education', detail: 'Owned the learning platform from architecture to launch, building the React frontend and Express/MongoDB backend.', kind: 'experience' },
  { mark: '02', date: 'AUG 2024 — PRESENT', title: 'B.Sc. Computer Science', place: 'Scaler School of Technology', detail: 'Software-first learning across systems, product thinking, and hands-on engineering.', kind: 'education' },
  { mark: '03', date: 'AUG 2024 — PRESENT', title: 'B.Sc. Computer Science', place: 'BITS Pilani', detail: 'Building deeper foundations in computer science alongside practical product work.', kind: 'education' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [repos, setRepos] = useState([]);
  const [repoState, setRepoState] = useState('idle');

  useEffect(() => {
    fetch('/api/github/repos').then((res) => { if (!res.ok) throw new Error('GitHub unavailable'); return res.json(); }).then((data) => { setRepos(data.slice(0, 6)); setRepoState('ready'); }).catch(() => setRepoState('error'));
  }, []);

  useEffect(() => {
    const moveSpotlight = (event) => { document.documentElement.style.setProperty('--mx', `${event.clientX}px`); document.documentElement.style.setProperty('--my', `${event.clientY}px`); };
    window.addEventListener('pointermove', moveSpotlight, { passive: true });
    return () => window.removeEventListener('pointermove', moveSpotlight);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return <>
    <SmoothScroll /><ScrollStory />
    <header className="nav-wrap"><nav className="nav container"><a className="brand" href="#top" onClick={closeMenu}><span className="brand-mark">A</span><span>aryen<span className="accent">.</span>me</span></a><button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button><div className={`nav-links ${menuOpen ? 'open' : ''}`}>{['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => <a key={item} href={`#${item.toLowerCase()}`} onClick={closeMenu}>{item}</a>)}<a className="nav-resume" href="/resume.pdf" download onClick={closeMenu}>Resume <Download size={14} /></a></div></nav></header>
    <div className="pointer-glow" aria-hidden="true" />
    <main id="top"><div className="flight-route" aria-hidden="true"><div className="space-dust"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><svg viewBox="0 0 100 1000" preserveAspectRatio="none"><path id="page-flight-path" d="M8 0 C18 90, 70 165, 92 250 C78 350, 28 410, 8 500 C22 600, 72 665, 92 760 C78 860, 30 930, 8 1000" /></svg><div className="orbit-marker marker-one" /><div className="orbit-marker marker-two" /><div className="page-plane"><SatelliteCraft /></div></div>
      <section className="hero container"><div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> Software developer / India</p><h1>Ideas in.<br /><em>Systems out.</em></h1><p className="hero-text">I am Aryen, a software developer building full-stack systems, AI products, and interfaces that make complex work feel clear.</p><div className="hero-actions"><a className="button primary" href="#projects">Explore the work <ArrowUpRight size={17} /></a><a className="button ghost" href="#contact">Start a conversation <ArrowUpRight size={17} /></a></div><div className="hero-meta"><span>Scroll to trace the route</span><span className="meta-line" /><span>01 — 06</span></div></div><div className="hero-art" aria-label="Portrait of Aryen Mukundam"><div className="hero-orbit orbit-a" aria-hidden="true" /><div className="hero-orbit orbit-b" aria-hidden="true" /><div className="hero-orbit orbit-c" aria-hidden="true" /><div className="hero-glow" aria-hidden="true" /><div className="portrait-frame"><img src={profileImage} alt="Aryen Mukundam" /><span className="portrait-label">Aryen / builder</span></div><span className="hero-coordinate">18.5204° N<br />73.8567° E</span></div></section>
      <section className="stream-section about container" id="about"><div className="stream-label">01 / About</div><div className="stream-grid"><h2 className="stream-reveal">About me.</h2><div className="stream-copy stream-reveal"><p>I like understanding how things work, then making them simpler. My work sits at the intersection of product thinking and engineering: learning platforms, retrieval pipelines, and high-throughput developer tools.</p><p>Every project is a chance to turn a vague problem into something people can actually use.</p><div className="quote-line">Building with curiosity and purpose.</div></div></div></section>
      <section className="stream-section skills container" id="skills"><div className="stream-label">02 / Skills</div><div className="section-intro stream-reveal"><h2>Skills and<br /><span>tools.</span></h2><p>The technologies I use to build reliable products and thoughtful interfaces.</p></div><div className="skill-grid">{skillGroups.map(([title, ...items], index) => <article className="skill-card stream-reveal" key={title}><span className="skill-index">0{index + 1}</span><h3>{title}</h3><div className="tags">{items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></section>
      <section className="stream-section projects container" id="projects"><div className="stream-label">03 / Projects</div><div className="section-intro project-heading stream-reveal"><div><h2>Selected<br /><span>projects.</span></h2><p>Real projects, real constraints, plenty of learning.</p></div><a className="text-link" href="https://github.com/aryen1101" target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={16} /></a></div><div className="project-grid">{projects.map((project) => <article className="project-card stream-reveal" key={project.title}><div className="project-top"><span>{project.number}</span><a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><ExternalLink size={17} /></a></div><p className="project-type">{project.type}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="tags">{project.tech.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div></section>
      <section className="github-strip container stream-reveal"><div><span className="eyebrow">Beyond the highlights</span><h3>There is more on GitHub.</h3></div><div className="github-status">{repoState === 'ready' ? <><span className="status-dot" /> {repos.length} public repositories found</> : repoState === 'error' ? 'GitHub is taking a moment — visit my profile directly.' : 'Loading latest repositories…'}<a href="https://github.com/aryen1101" target="_blank" rel="noreferrer"><Code2 size={19} /></a></div></section>
      <section className="career-section stream-section container" id="experience"><div className="stream-label">04 / Experience and education</div><div className="career-heading stream-reveal"><div><h2>Experience and<br /><span>education.</span></h2></div><p>My work and studies across Bricks, Scaler School of Technology, and BITS Pilani.</p></div><div className="career-map"><div className="career-list">{career.map((item) => <article className={`career-card stream-reveal ${item.kind}`} key={item.mark}><span className="career-mark">{item.mark}</span><div><span className="timeline-date">{item.date}</span><h3>{item.title}</h3><h4>{item.place}</h4><p>{item.detail}</p>{item.kind === 'experience' && <a className="text-link" href="https://bricks.org.in" target="_blank" rel="noreferrer">Visit Bricks <ArrowUpRight size={15} /></a>}</div></article>)}</div></div></section>
      <section className="contact stream-section container" id="contact"><div className="contact-box stream-reveal"><div><div className="stream-label">06 / Contact</div><h2>Let us work<br /><em>together.</em></h2><p>Have an interesting idea or opportunity? I am always open to a thoughtful conversation.</p></div><a className="contact-mail" href="mailto:aryenmukundam@gmail.com"><Mail size={20} /> aryenmukundam@gmail.com <ArrowUpRight size={17} /></a></div></section>
    </main>
    <footer className="footer container"><a className="brand" href="#top"><span className="brand-mark">A</span><span>aryen<span className="accent">.</span>me</span></a><span>Still curious. Still shipping. · {new Date().getFullYear()}</span><div><a href="https://github.com/aryen1101" target="_blank" rel="noreferrer"><Code2 size={17} /></a><a href="https://leetcode.com/u/Aryen1101/" target="_blank" rel="noreferrer"><BriefcaseBusiness size={17} /></a><a href="https://www.linkedin.com/in/aryen-mukundam-298b4a315/" target="_blank" rel="noreferrer"><BriefcaseBusiness size={17} /></a><a href="mailto:aryenmukundam@gmail.com"><Mail size={17} /></a></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
