import type { JSX, ReactNode } from 'react';
import styles from './WorkApp.module.css';

interface CaseStudySectionProps {
  index: number;
  title: 'Problem' | 'Ownership' | 'Approach' | 'Rollout' | 'Outcome';
  children: ReactNode;
  idPrefix?: string;
}

export function CaseStudySection({ index, title, children, idPrefix = 'work' }: CaseStudySectionProps): JSX.Element {
  const titleId = `${idPrefix}-section-${index}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <p className={styles.sectionNumber} aria-hidden="true">0{index}</p>
      <div>
        <h2 className={styles.sectionTitle} id={titleId}>{title}</h2>
        <p className={styles.sectionCopy}>{children}</p>
      </div>
    </section>
  );
}
