import type { JSX } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import { ProjectMedia } from '../../components/ProjectMedia';
import { projects } from '../../data/projects';
import { UtilityIcon } from '../../shell/UtilityIcon';
import styles from './ProjectsApp.module.css';

export function ProjectsApp(): JSX.Element {
  const { state, dispatch } = usePortfolio();
  const RouteHeading = state.route.kind === 'projects' ? 'h1' : 'h2';

  return (
    <article className={styles.catalogue} aria-labelledby="projects-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Personal systems / {String(projects.length).padStart(2, '0')}</p>
        <RouteHeading id="projects-title">Engineering projects</RouteHeading>
        <p>Working software, shaped around delivery, operations, and the people using it.</p>
      </header>
      <div className={styles.entries}>
        {projects.map((project, index) => {
          const featured = index === 0;
          const landscape = project.id !== 'taskmon';
          const repositoryUrl = 'repositoryUrl' in project ? project.repositoryUrl : undefined;
          return (
            <section
              className={[featured ? styles.featured : styles.compact, landscape ? styles.landscape : ''].join(' ')}
              data-testid={`project-entry-${project.id}`}
              data-featured={featured || undefined}
              key={project.id}
            >
              <div className={styles.copy}>
                <p className={styles.index}>{String(index + 1).padStart(2, '0')} / {project.category}</p>
                <h2>{project.title}</h2>
                <p className={styles.blurb}>{project.blurb}</p>
                <ul className={styles.tags} aria-label={`${project.title} technologies`}>
                  {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className={styles.actions}>
                  <button
                    className={styles.primaryAction}
                    type="button"
                    aria-label={`Open ${project.title} case study`}
                    onClick={() => dispatch({ type: 'SELECT_PROJECT', projectId: project.id })}
                  >
                    Open case study <span aria-hidden="true">→</span>
                  </button>
                  {repositoryUrl ? (
                    <a
                      className={styles.repositoryAction}
                      href={repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <UtilityIcon kind="github" />
                    </a>
                  ) : (
                    <button
                      className={styles.repositoryAction}
                      type="button"
                      disabled
                      title="GitHub repository not available yet"
                      aria-label={`View ${project.title} on GitHub — repository not available yet`}
                    >
                      <UtilityIcon kind="github" />
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.mediaArea}>
                <a
                  href={`${import.meta.env.BASE_URL}${project.image}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} screenshot full size`}
                >
                  <ProjectMedia project={project} />
                </a>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
