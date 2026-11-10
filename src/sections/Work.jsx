import { projects } from '../data/projects.js';
import { profile } from '../data/profile.js';
import SectionHead from '../components/SectionHead.jsx';
import ProjectPlate from '../components/ProjectPlate.jsx';
import OutLink from '../components/OutLink.jsx';
import { useGithubActivity } from '../lib/useGithubActivity.js';
import { timeAgo } from '../lib/time.js';
import './work.css';

// Case-study repositories, and ones deliberately not featured, are left out of the recent list.
const featured = new Set(['PRHawk', 'Notebook_LLM', 'Search_Typeahead', 'Bricks', 'Website_Automation_Agent']);

export default function Work() {
  const github = useGithubActivity();
  const recent = github.recent.filter((repo) => !featured.has(repo.name)).slice(0, 4);

  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead id="work" title="Selected work">
          <p>Four projects, each with the problem it solves, what I built, and how it works inside.</p>
        </SectionHead>

        {projects.map((project, i) => (
          <ProjectPlate key={project.id} project={project} flip={i % 2 === 1} />
        ))}

        {recent.length ? (
          <div className="recent">
            <div className="recent-head">
              <h3>Recently pushed to GitHub</h3>
              <OutLink href={profile.links.github}>All {github.publicRepos} public repositories</OutLink>
            </div>
            <ul className="recent-list">
              {recent.map((repo) => (
                <li key={repo.name}>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer">
                    <span className="recent-name">{repo.name.replaceAll('_', ' ')}</span>
                    <span className="recent-meta data">
                      {repo.language || 'Repository'}, {timeAgo(repo.pushedAt)}
                    </span>
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
