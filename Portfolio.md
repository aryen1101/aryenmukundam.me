# Build My Personal Developer Portfolio Website

Act as a senior frontend engineer and UI/UX designer. I want you to build a complete, modern, visually impressive, responsive personal developer portfolio website.

Don't just create a basic template. I want a polished portfolio that looks like it was designed by a professional developer.

## 1. Tech Stack

Use the following technologies:

- React.js (Vite)
- JavaScript
- Tailwind CSS
- Framer Motion for animations
- Lucide React for icons
- React Router if required
- GitHub API to fetch my repositories
- Vercel for deployment

Keep the architecture clean, modular, reusable, and easy to maintain.

## 2. Personal Information

Use the following information:

- Name: Aryen Mukundam
- Role: Software Developer | Full Stack Developer | Aspiring Software Engineer
- GitHub: AryenMukundam
- GitHub URL: https://github.com/AryenMukundam
- Domain: aryen.me (intended custom domain)
- Education: Scaler School of Technology
- Location: India

Create a short, impactful introduction that highlights my interest in software development, problem-solving, full-stack development, machine learning, and DevOps.

Avoid exaggerated claims. Keep the content professional and authentic.

## 3. Design Direction

I want a premium, modern developer portfolio.

Design inspiration:
- Minimalistic but visually rich.
- Dark theme by default.
- Black/charcoal background with subtle gradients.
- White typography with a single vibrant accent color.
- Smooth scrolling.
- Subtle hover interactions.
- Beautiful typography.
- Glassmorphism used sparingly.
- Smooth page transitions and micro-animations.
- Excellent spacing and alignment.

The website should feel like a premium personal brand rather than a generic portfolio template.

Make the design fully responsive for desktop, tablets, and mobile devices.

## 4. Website Sections

### A. Navbar
- Personal logo/name.
- Home
- About
- Skills
- Projects
- Experience
- Contact
- Resume button.
- Sticky navigation with smooth scrolling.
- Mobile-friendly hamburger menu.

### B. Hero Section

Create an impressive landing section.

Include:
- "Hi, I'm Aryen Mukundam"
- A dynamic typing animation showing:
  - Software Developer
  - Full Stack Developer
  - Problem Solver
  - Tech Enthusiast
- A short introduction.
- View Projects button.
- Contact Me button.
- GitHub and LinkedIn icons.
- A visually interesting background with subtle animated elements.

Make the hero section immediately communicate my identity as a developer.

### C. About Me

Write a concise introduction about me.

Mention:
- My journey into technology and software development.
- My experience learning and building projects.
- My interest in full-stack development, machine learning, and DevOps.
- My enthusiasm for solving real-world problems.

Use an attractive layout rather than a plain paragraph.

### D. Technical Skills

Organize my skills into categories.

Programming Languages:
- Java
- Python
- JavaScript
- SQL

Frontend:
- HTML
- CSS
- React.js
- React Native
- Expo

Backend:
- Node.js
- Express.js
- REST APIs

Databases:
- MySQL
- MongoDB

Machine Learning:
- NumPy
- Pandas
- Scikit-learn
- Matplotlib

DevOps:
- Docker
- Kubernetes
- Git
- GitHub
- ArgoCD
- Prometheus
- Grafana

Display skills using attractive icons, badges, or interactive cards.

### E. Projects — IMPORTANT

This is one of the most important sections.

I want you to FETCH MY REAL PROJECTS DIRECTLY FROM MY GITHUB ACCOUNT.

GitHub username: AryenMukundam

GitHub profile: https://github.com/AryenMukundam

Requirements:

1. Use the GitHub REST API to fetch my public repositories.
2. Dynamically retrieve repository names, descriptions, GitHub URLs, languages, stars, and forks.
3. Display projects in visually appealing cards.
4. Include GitHub repository links.
5. Add a button to view the repository.
6. Add language tags for each project.
7. Sort repositories by recently updated.
8. Add loading skeletons while fetching data.
9. Handle API errors gracefully.
10. Include a fallback UI if the API is unavailable.

Do not create fake projects or invent project descriptions.

For each repository, use its actual description where available. If a description is missing, inspect its README to understand the project before writing a short summary.

Also, highlight the most relevant repositories in a featured projects section.

Make the project section visually impressive, with hover animations and clean layouts.

### F. Experience & Education

Education:
Scaler School of Technology

Mention my learning journey and hands-on development experience.

Keep this section editable so I can add internships, work experience, achievements, and certifications later.

Do not invent employment history or achievements.

### G. Contact Section

Include:
- Email (keep configurable until I provide my email).
- GitHub.
- LinkedIn (keep configurable until I provide my profile URL).
- A contact form with name, email, subject, and message.

Create a professional call-to-action such as:

"Have an interesting idea or opportunity? Let's build something together."

Make sure the contact form has proper validation. Do not show a fake success message if the form is not connected to a backend or email service.

### H. Footer

Include:
- My name.
- Social links.
- Quick navigation links.
- Copyright with dynamically updated year.
- "Designed & Built by Aryen Mukundam."

## 5. Resume Integration

Create a dedicated resume download button.

Keep the resume file configurable in the public folder so I can upload my PDF later.

If the resume doesn't exist, don't show a broken download link.

## 6. GitHub Integration

The GitHub integration is especially important.

Use:

https://api.github.com/users/AryenMukundam/repos?sort=updated&per_page=100

Fetch my repositories dynamically.

Also fetch individual repository details if required.

Use GitHub API responsibly:
- Handle rate limits.
- Handle network failures.
- Cache responses where appropriate.
- Don't expose any private tokens in frontend code.
- Don't request private repository access.

## 7. Domain and Deployment

I intend to use the custom domain:

aryen.me

Prepare the project for deployment on Vercel.

Requirements:
- Configure Vercel deployment.
- Ensure SPA routing works correctly.
- Add SEO metadata.
- Add Open Graph metadata.
- Add a favicon.
- Add a proper page title and description.
- Ensure HTTPS compatibility.
- Document how to connect aryen.me through Vercel's domain settings.
- Document the required DNS records.

Important: Do not assume that I already own the domain. Make the website deployment-ready so I can connect it once I register it.

## 8. Performance and Quality

Ensure:
- Fast loading.
- Responsive images.
- Lazy loading where appropriate.
- Optimized components.
- Clean React component structure.
- No unnecessary dependencies.
- Accessible HTML elements.
- Good color contrast.
- SEO-friendly structure.
- No console errors.
- No broken links.
- No horizontal overflow on mobile.

## 9. Project Structure

Organize the code into reusable components.

Suggested structure:

src/
  components/
  sections/
  hooks/
  services/
  data/
  assets/
  App.jsx
  main.jsx
  index.css

Keep GitHub API logic separate from UI components.

## 10. Execution Instructions

Before coding:

1. Inspect the current working directory.
2. Check whether an existing project is present.
3. If a project exists, understand its structure before making changes.
4. If the directory is empty, initialize the project.

Then:

1. Set up all dependencies.
2. Implement the complete website.
3. Fetch real GitHub repository data.
4. Test all sections and interactions.
5. Run the development server.
6. Fix all build errors and warnings.
7. Verify responsive behavior.
8. Provide instructions for running locally and deploying to Vercel.

Do not stop after creating a basic landing page. Implement all the sections.

Make sensible design decisions independently without asking me about every small detail.

The final result should be a polished, production-ready developer portfolio that I can proudly share with recruiters, developers, and potential collaborators.

Removed the orbiting dot and its GSAP animation.
