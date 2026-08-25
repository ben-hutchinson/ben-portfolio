import { useState, type JSX } from 'react';
import type { Project } from '../data/models';
import styles from './ProjectMedia.module.css';

export function ProjectMedia({ project }: { readonly project: Project }): JSX.Element {
  const [failed, setFailed] = useState(false);

  return (
    <div className={styles.frame} data-testid={`project-media-${project.id}`}>
      {failed ? (
        <div className={styles.fallback} role="img" aria-label={`${project.title} project preview unavailable`}>
          <span className={styles.mark} aria-hidden="true">×</span>
          <strong>Preview unavailable</strong>
          <span>{project.title}</span>
        </div>
      ) : (
        <img
          className={styles.image}
          src={`${import.meta.env.BASE_URL}${project.image}`}
          alt={`${project.title} project interface`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
