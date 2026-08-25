import type { JSX } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import { ProjectMedia } from '../../components/ProjectMedia';
import { projects } from '../../data/projects';
import styles from './ProjectDetailApp.module.css';

export function ProjectDetailApp(): JSX.Element | null {
  const { state, dispatch } = usePortfolio();
  const project = projects.find(({ id }) => id === state.activeProjectId);
  if (project === undefined) return null;

  return (
    <article className={styles.detail} aria-labelledby="project-detail-title" data-project-detail={project.id}>
      <button className={styles.back} type="button" aria-label="Back to projects" onClick={() => dispatch({ type: 'OPEN_APP', appId: 'projects' })}>← Back to projects</button>
      <header className={styles.header}>
        <p>Personal project / {project.id}</p>
        <h1 id="project-detail-title">{project.title}</h1>
      </header>
      <ProjectMedia project={project} />
      <div className={styles.evidence}>
        <section>
          <h2>Purpose &amp; system shape</h2>
          <p>{project.blurb}</p>
        </section>
        <section>
          <h2>Technologies</h2>
          <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        </section>
      </div>
      <footer className={styles.actions} aria-label={`${project.title} links`}>
        {project.links.map((link) => <a aria-label={link.label} href={link.href} target="_blank" rel="noreferrer noopener" key={`${link.label}-${link.href}`}>{link.label} ↗</a>)}
      </footer>
    </article>
  );
}
