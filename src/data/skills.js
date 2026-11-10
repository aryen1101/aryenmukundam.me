// "used" = shipped in a project or repository you can open.
// "exploring" = studied or practised in learning repos, not yet in a flagship project.
// `in` lists which projects used a skill, which powers the project filter.

export const skillProjects = [
  { id: 'prhawk', label: 'PRHawk' },
  { id: 'notebookllm', label: 'NotebookLLM' },
  { id: 'typeahead', label: 'Search Typeahead' },
  { id: 'bricks', label: 'Bricks' },
];

export const skillGroups = [
  {
    name: 'Languages',
    used: [
      { name: 'JavaScript', in: ['notebookllm', 'bricks'] },
      { name: 'TypeScript', in: ['prhawk', 'typeahead'] },
      { name: 'SQL', in: ['typeahead'] },
      { name: 'Java' },
      { name: 'Python' },
    ],
    exploring: [{ name: 'Rust' }],
  },
  {
    name: 'Frontend',
    used: [
      { name: 'React', in: ['prhawk', 'notebookllm', 'bricks'] },
      { name: 'Tailwind CSS', in: ['notebookllm', 'bricks'] },
      { name: 'Vite', in: ['notebookllm'] },
      { name: 'HTML and CSS', in: ['typeahead'] },
    ],
    exploring: [{ name: 'React Native' }, { name: 'Redux Toolkit' }],
  },
  {
    name: 'Backend',
    used: [
      { name: 'Node.js', in: ['prhawk', 'notebookllm', 'typeahead', 'bricks'] },
      { name: 'Express', in: ['prhawk', 'notebookllm', 'typeahead', 'bricks'] },
      { name: 'REST APIs', in: ['prhawk', 'notebookllm', 'typeahead', 'bricks'] },
      { name: 'JWT and role-based access', in: ['bricks'] },
      { name: 'Spring Boot' },
    ],
    exploring: [],
  },
  {
    name: 'AI and retrieval',
    used: [
      { name: 'LLM API integration', in: ['prhawk', 'notebookllm'] },
      { name: 'RAG', in: ['notebookllm'] },
      { name: 'LangChain', in: ['notebookllm'] },
      { name: 'Embeddings (Hugging Face)', in: ['notebookllm'] },
      { name: 'Qdrant', in: ['notebookllm'] },
      { name: 'Structured output with Zod', in: ['prhawk'] },
      { name: 'LLM-as-judge', in: ['notebookllm'] },
      { name: 'Prompt engineering', in: ['prhawk', 'notebookllm'] },
    ],
    exploring: [{ name: 'LangGraph' }, { name: 'OpenAI Agents SDK' }],
  },
  {
    name: 'Data',
    used: [
      { name: 'MongoDB', in: ['prhawk', 'bricks'] },
      { name: 'Redis', in: ['typeahead'] },
      { name: 'Apache Kafka', in: ['typeahead'] },
      { name: 'SQLite', in: ['typeahead'] },
      { name: 'MySQL' },
    ],
    exploring: [],
  },
  {
    name: 'Infrastructure and tools',
    used: [
      { name: 'Docker', in: ['typeahead'] },
      { name: 'Git and GitHub', in: ['prhawk', 'notebookllm', 'typeahead', 'bricks'] },
      { name: 'GitHub API', in: ['prhawk'] },
      { name: 'Vercel', in: ['prhawk', 'notebookllm'] },
      { name: 'Postman' },
    ],
    exploring: [
      { name: 'Kubernetes' },
      { name: 'Argo CD' },
      { name: 'Terraform' },
      { name: 'Prometheus' },
      { name: 'Grafana' },
      { name: 'AWS fundamentals' },
    ],
  },
  {
    name: 'Foundations',
    used: [
      { name: 'Data structures and algorithms' },
      { name: 'Object-oriented design' },
      { name: 'Low-level design' },
      { name: 'Database systems' },
      { name: 'Operating systems' },
      { name: 'Computer networks' },
      { name: 'System design fundamentals' },
    ],
    exploring: [],
  },
];
