import prhawkShot from '../assets/shots/prhawk.webp';
import notebookShot from '../assets/shots/notebook.webp';
import typeaheadPoster from '../assets/shots/typeahead/autocomplete.webp';
import bricksPoster from '../assets/shots/bricks/dashboard.webp';

// Every figure below comes from the résumé or the project's own repository.
// A pipeline is a list of lanes; each lane is an ordered list of steps.
// A step with `branches` splits into parallel paths.

export const projects = [
  {
    id: 'prhawk',
    name: 'PRHawk',
    kind: 'AI developer tool',
    year: '2026',
    pitch: 'A GitHub App that reviews every pull request and posts line-level feedback, using the team’s own conventions.',
    problem:
      'Reviewers lose time on comments a machine could catch, and generic AI reviewers ignore how a team actually writes code.',
    built: [
      'Installs as a GitHub App: every opened, reopened or updated pull request gets a 0–100 quality score and one of 3 merge decisions.',
      'Classifies every finding into 5 severity classes with 6 structured fields validated by Zod, anchored to the diff’s added lines.',
      'Keeps large pull requests inside a 60,000-character prompt with 8,000-character diff caps, ±30-line code excerpts and a 40-rule cap, listing every skipped file.',
      'Learns team rules from the 10 newest merged pull requests, refreshing each convention source at most once a day, so a merge costs 1 LLM run instead of N+1.',
      'Secures the settings page with GitHub sign-in and HMAC-signed sessions, limited to installations the user can access.',
    ],
    figures: [
      { value: '5', label: 'severity classes per finding' },
      { value: '60K', label: 'character prompt budget per review' },
      { value: '9 s', label: 'from opening a 16-line test PR to its review' },
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'Express', 'GitHub Apps', 'Octokit', 'MongoDB', 'OpenAI / Groq', 'Zod', 'GSAP'],
    links: { live: 'https://pr-hawk.vercel.app', source: 'https://github.com/aryen1101/PRHawk' },
    shot: { src: prhawkShot, alt: 'PRHawk landing page showing a real review of a test pull request' },
    pipeline: [
      {
        label: 'On pull request',
        steps: [
          { title: 'GitHub webhook', note: 'opened, synchronize or reopened; signature checked' },
          { title: 'Fetch the diff', note: 'installation token, Octokit' },
          { title: 'Fit the budget', note: 'skip lock files, 60K chars, ±30-line excerpts' },
          { title: 'Load team rules', note: 'repository, sources and custom rules; 40 max' },
          { title: 'LLM review', note: 'OpenAI first, Groq fallback' },
          { title: 'Validate with Zod', note: 'up to 3 retries per provider' },
          { title: 'Post to GitHub', note: 'inline comments, score, merge decision' },
        ],
      },
      {
        label: 'On merge',
        steps: [
          { title: 'Merged pull request', note: 'webhook, closed and merged' },
          { title: 'Sample merged PRs', note: '10 newest, 2,500 chars each' },
          { title: 'Extract team rules', note: 'LLM, validated by Zod' },
          { title: 'Store in MongoDB', note: 'sources refreshed at most daily' },
        ],
      },
    ],
  },
  {
    id: 'notebookllm',
    name: 'NotebookLLM',
    kind: 'Retrieval-augmented generation',
    year: '2026',
    pitch: 'Upload a document and question it, with every answer graded before you see it.',
    problem:
      'A single vector search misses multi-part questions, and a chatbot that answers confidently from weak context is worse than no answer.',
    built: [
      'Ingests PDF, TXT and CSV up to 20 MB with two strategies: 1,000/200-character splits and 10-row CSV batches, stored as 384-dim vectors.',
      'A 5-stage query pipeline rewrites the question, decomposes it into up to 4 sub-queries, searches top-4 for each and merges up to 16 candidates down to 6 chunks.',
      'An LLM-as-judge scores groundedness and relevance from 1 to 5 and regenerates any answer scoring 2 or lower.',
      'A citation-first workspace: numbered citation chips open the exact passage in a sources panel, and every answer exposes its rewritten query, sub-queries and judge verdict. Light, dark and system themes.',
      'Swaps in a new document only after all its embeddings succeed, so a failed or timed-out upload never empties the index; scanned PDFs get an OCR hint instead of a generic error.',
    ],
    figures: [
      { value: '4', label: 'max sub-queries per question' },
      { value: '16 → 6', label: 'candidates merged into context' },
      { value: '≤ 2', label: 'judge score that forces a rewrite' },
    ],
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'LangChain', 'Qdrant', 'Hugging Face embeddings', 'Groq', 'Gemini'],
    links: { live: 'https://notebook-llm-sigma.vercel.app', source: 'https://github.com/aryen1101/Notebook_LLM' },
    shot: {
      src: notebookShot,
      alt: 'NotebookLLM workspace answering a question with a citation, next to a sources panel listing the passages used',
    },
    pipeline: [
      {
        label: 'On upload',
        steps: [
          { title: 'PDF, TXT or CSV', note: 'up to 20 MB' },
          { title: 'Chunk', note: '1,000 / 200 splits · 10-row CSV batches' },
          { title: 'Embed', note: 'bge-small, 384 dimensions' },
          { title: 'Swap into Qdrant', note: 'old document kept until embedding succeeds' },
        ],
      },
      {
        label: 'On question',
        steps: [
          { title: 'Translate and rewrite', note: 'standalone English query' },
          { title: 'Decompose', branches: ['sub-query', 'sub-query', 'sub-query', 'sub-query'] },
          { title: 'Merge and dedupe', note: '16 candidates → 6 chunks' },
          { title: 'Generate', note: 'grounded in context only' },
          { title: 'Judge', note: 'score 1–5, regenerate if ≤ 2' },
        ],
      },
    ],
  },
  {
    id: 'typeahead',
    name: 'Search Typeahead',
    kind: 'Distributed systems',
    year: '2026',
    pitch: 'Search-as-you-type suggestions served from a sharded cache in about a millisecond.',
    problem:
      'Suggestions have to arrive between keystrokes, while every search also has to be counted without hammering the database.',
    built: [
      'Serves top-10 suggestions from a 591,775-query dataset at 1.26 ms p50 and about 2,897 requests per second.',
      'A 3-node Redis ring with consistent hashing and 150 virtual nodes per node holds a 93.8% cache hit rate, with 60 s TTL invalidation.',
      'Batched Kafka write-behind cut database writes about 3.6×: 2,000 searches became 555 row updates.',
      'A recency-aware trending ranker decays scores by 0.9 so old spikes fade.',
      'A dependency-free UI that draws the live hash ring, shows which node served each prefix (hit or miss, server time), and follows every search through Kafka until its new count lands in SQLite.',
    ],
    figures: [
      { value: '1.26 ms', label: 'p50 suggestion latency' },
      { value: '93.8%', label: 'cache hit rate' },
      { value: '~3.6×', label: 'fewer database writes' },
    ],
    stack: ['TypeScript', 'Node.js', 'Express', 'Redis', 'Apache Kafka', 'SQLite', 'nginx', 'Docker Compose'],
    status: 'Not deployed: it runs locally on Docker Compose (3 Redis nodes, Kafka, API, nginx). The demo video is from a local run against the real dataset.',
    media: {
      video: {
        src: '/assets/typeahead/searchtypeahead-demo.webm',
        poster: typeaheadPoster,
        alt: '38-second demo: typing prefixes, keyboard navigation, switching ranking, and recording searches',
        caption: 'Typing routes each prefix around the hash ring; a search is followed until its count changes in SQLite.',
      },
      shots: [],
    },
    links: {
      source: 'https://github.com/aryen1101/Search_Typeahead',
      video: 'https://drive.google.com/file/d/1KxaegMsXSIbjEC45-4T06HSE5j6S_TzJ/view?usp=drive_link',
    },
    pipeline: [
      {
        label: 'On keystroke',
        steps: [
          { title: 'Prefix typed', note: 'GET /suggest' },
          { title: 'Consistent hash', note: '3 Redis nodes × 150 virtual nodes' },
          { title: 'Cache lookup', branches: ['hit → return', 'miss → SQLite scan'] },
          { title: 'Cache the top 10', note: '60 s TTL' },
        ],
      },
      {
        label: 'On search',
        steps: [
          { title: 'Search recorded', note: 'POST /search returns at once' },
          { title: 'Kafka topic', note: '3 partitions' },
          { title: 'Batch consumer', note: 'aggregates duplicate queries' },
          { title: 'One SQLite transaction', note: 'plus 0.9 trending decay' },
        ],
      },
    ],
  },
  {
    id: 'bricks',
    name: 'Bricks Dashboard',
    kind: 'Education platform',
    year: '2025',
    pitch: 'The learning platform behind Bricks Education, built for how its schools actually ran classes.',
    problem:
      'Workshops ran across several partner schools in small batches, so classes, materials and meeting links had to reach exactly the right students.',
    built: [
      'Shipped a MERN learning-management platform to production with 2 role-scoped dashboards, for instructors and students.',
      'No public sign-up by design: accounts are created at onboarding and mapped to a school and batch.',
      'JWT authentication with token-blacklist logout and role-based control over classes, assignments and students.',
      '4 REST route groups (student, instructor, class, assignment) over Mongoose models, with a reusable React UI.',
    ],
    figures: [
      { value: '2', label: 'role-scoped dashboards' },
      { value: '4', label: 'REST route groups' },
      { value: '~2,000', label: 'students taught through Bricks' },
    ],
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT'],
    media: {
      video: {
        src: '/assets/bricks/bricks-dashboard-demo.webm',
        poster: bricksPoster,
        alt: '81-second walkthrough of the student and teacher dashboards: joining a live class, materials, submitting an assignment, the leaderboard, scheduling a class, sharing a recording, batch rosters and submissions',
        caption: 'A student joins a live class, submits an assignment and checks the leaderboard; a teacher schedules a class, shares a recording and reviews submissions. Recorded locally with seeded test accounts.',
      },
      shots: [],
    },
    links: { source: 'https://github.com/aryen1101/Bricks' },
    pipeline: [
      {
        label: 'Access',
        steps: [
          { title: 'Onboarding', note: 'accounts created by admins, no public sign-up' },
          { title: 'School and batch mapping', note: 'every user belongs to a cohort' },
          { title: 'JWT + role middleware', note: 'blacklisted tokens on logout' },
          { title: 'Dashboard', branches: ['instructor: classes, assignments, links', 'student: upcoming classes, materials'] },
        ],
      },
    ],
  },
];
