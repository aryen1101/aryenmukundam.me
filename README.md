# Aryen Mukundam — Software Developer

> Thoughtful products. Reliable systems. Interfaces that make complex work feel clear.

[![Portfolio](https://img.shields.io/badge/Portfolio-aryen.me-9bd8c8?style=for-the-badge&logo=vercel&logoColor=0b0d0f)](https://aryen.me)
[![GitHub](https://img.shields.io/badge/GitHub-aryen1101-181717?style=for-the-badge&logo=github)](https://github.com/aryen1101)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/aryen-mukundam-298b4a315/)

A personal portfolio for **Aryen Mukundam**, a software engineering student in Bengaluru. The site is designed as a ground station: a satellite orbits the name in the hero, then flies a route through every section, lighting each section's waypoint as it passes.

## ✦ What’s inside

- Hero, About, Selected work, Stack, Experience, Education, Practice and Contact sections
- Case studies for PRHawk, NotebookLLM, Search Typeahead and Bricks, each with an animated architecture diagram
- A stack table that can be narrowed to the skills and languages of one project
- Scroll-driven satellite flight (GSAP + Lenis) with a full reduced-motion fallback
- Recent GitHub activity fetched live in the browser, with a build-time snapshot as fallback
- Downloadable résumé

## Built with

`React` · `Vite` · `JavaScript` · `GSAP` · `ScrollTrigger` · `Lenis` · `Lucide React` · `Bricolage Grotesque` · `Node.js`

## Run locally

**Requirements:** Node.js 20.19+ or 22.12+ and npm.

```bash
git clone https://github.com/aryen1101/aryenmukundam.me.git
cd aryenmukundam.me
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

Recent GitHub activity is fetched live from GitHub's public API in each visitor's browser (cached for 10 minutes per session). Until it arrives, or if GitHub is unreachable, the page shows the snapshot in `src/data/github.json`, which `npm run sync` refreshes and every build updates automatically.

## Production

Create an optimized static build:

```bash
npm run build
```

Preview the build with Vite:

```bash
npm run preview
```

Or serve the built `dist/` directory with the included Node server:

```bash
npm start
```

The server listens on port `3000` by default. Set `PORT` to choose another port. It also exposes `/api/health` and `/api/github/repos`.

## Project map

```text
src/data/            All site content: profile, projects, skills, experience, practice
src/sections/        One component and stylesheet per page section
src/components/      Nav, section heading with waypoint, project plate, pipeline diagram
src/motion/          GSAP setup, Lenis smooth scroll, satellite flight system
src/styles/          Design tokens and base styles
src/assets/          Portrait and project screenshots (WebP)
scripts/             Build-time GitHub snapshot
public/              Résumé, favicon and social preview image
server.js            Optional production static server
```

## Connect

- Portfolio: [aryen.me](https://aryen.me)
- Email: [aryenmukundam@gmail.com](mailto:aryenmukundam@gmail.com)
- GitHub: [@aryen1101](https://github.com/aryen1101)
- LinkedIn: [Aryen Mukundam](https://www.linkedin.com/in/aryen-mukundam-298b4a315/)

---

<p align="center">Made with curiosity in India · © Aryen Mukundam</p>
