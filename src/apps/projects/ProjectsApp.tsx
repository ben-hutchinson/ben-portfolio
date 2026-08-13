import type { JSX } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import { ProjectMedia } from '../../components/ProjectMedia';
import { projects } from '../../data/projects';
import styles from './ProjectsApp.module.css';

export function ProjectsApp(): JSX.Element {
  const { state, dispatch } = usePortfolio();
  const RouteHeading = state.route.kind === 'projects' ? 'h1' : 'h2';

  return (
    <article className={styles.catalogue} aria-labelledby="projects-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Personal systems / 02</p>
        <RouteHeading id="projects-title">Engineering projects</RouteHeading>
        <p>Working software, shaped around delivery, operations, and the people using it.</p>
      </header>
      <div className={styles.entries}>
        {projects.map((project, index) => {
          const featured = index === 0;
          return (
            <section
              className={featured ? styles.featured : styles.compact}
              data-testid={`project-entry-${project.id}`}
              data-featured={featured || undefined}
              key={project.id}
            >
              <div className={styles.copy}>
                <p className={styles.index}>0{index + 1} / {featured ? 'Featured build' : 'Focused utility'}</p>
                <h2>{project.title}</h2>
                <p className={styles.blurb}>{project.blurb}</p>
                <ul className={styles.tags} aria-label={`${project.title} technologies`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <button
                  type="button"
                  aria-label={`Open ${project.title} case study`}
                  onClick={() => dispatch({ type: 'SELECT_PROJECT', projectId: project.id })}
                >
                  Open case study <span aria-hidden="true">→</span>
                </button>
              </div>
              <ProjectMedia project={project} />
            </section>
          );
        })}
      </div>
    </article>
  );
}
