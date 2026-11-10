import { useEffect, useState } from 'react';
import snapshot from '../data/github.json';

const USER = 'aryen1101';
const CACHE_KEY = 'gh-activity-v1';
const CACHE_MS = 10 * 60 * 1000;

const shape = (repos) =>
  repos
    .filter((repo) => !repo.fork && repo.name.toLowerCase() !== USER)
    .slice(0, 8)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      pushedAt: repo.pushed_at,
    }));

// One request per page load, shared by every component that asks.
let request = null;

function loadLive() {
  if (request) return request;
  request = (async () => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;
    } catch {
      /* storage unavailable: fetch instead */
    }
    const headers = { Accept: 'application/vnd.github+json' };
    const [reposRes, userRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=30`, { headers }),
      fetch(`https://api.github.com/users/${USER}`, { headers }),
    ]);
    if (!reposRes.ok || !userRes.ok) throw new Error('GitHub unavailable');
    const [repos, user] = await Promise.all([reposRes.json(), userRes.json()]);
    const data = { recent: shape(repos), publicRepos: user.public_repos };
    if (!data.recent.length) throw new Error('No repositories');
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    } catch {
      /* ignore */
    }
    return data;
  })();
  request.catch(() => {});
  return request;
}

/*
  Recent GitHub activity, kept current on its own.
  The page renders the build-time snapshot first (no layout shift, works with
  no network), then swaps in live data from GitHub's public API. Results are
  cached per browser session for 10 minutes; any failure, such as rate
  limiting, keeps the snapshot.
*/
export function useGithubActivity() {
  const [data, setData] = useState({ recent: snapshot.recent || [], publicRepos: snapshot.publicRepos, live: false });

  useEffect(() => {
    let cancelled = false;
    loadLive()
      .then((live) => {
        if (!cancelled) setData({ ...live, live: true });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
