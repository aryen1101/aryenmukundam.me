// Snapshots public GitHub activity into src/data/github.json at build time.
// The site reads the snapshot instead of calling GitHub from the browser, so it
// works on any static host (Vercel included) and never hits the rate limit.
// If GitHub is unreachable the previous snapshot is kept and the build continues.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = 'aryen1101';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outFile = path.join(root, 'src', 'data', 'github.json');

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'aryen-portfolio-sync' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(url) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

try {
  const [user, repos] = await Promise.all([
    get(`https://api.github.com/users/${USER}`),
    get(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`),
  ]);

  const own = repos.filter((repo) => !repo.fork && repo.name.toLowerCase() !== USER);
  const snapshot = {
    syncedAt: new Date().toISOString(),
    publicRepos: user.public_repos,
    recent: own.slice(0, 6).map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      pushedAt: repo.pushed_at,
    })),
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`GitHub snapshot written: ${snapshot.publicRepos} public repos, latest push ${snapshot.recent[0]?.name}.`);
} catch (error) {
  console.warn(`GitHub sync skipped (${error.message}). Keeping the existing snapshot.`);
}
