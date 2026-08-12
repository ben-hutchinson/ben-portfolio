import type { JSX, ReactNode } from 'react';
import styles from './WorkApp.module.css';

interface CaseStudySectionProps {
  index: number;
  title: 'Problem' | 'Ownership' | 'Approach' | 'Rollout' | 'Outcome';
  children: ReactNode;
}

export function CaseStudySection({ index, title, children }: CaseStudySectionProps): JSX.Element {
  return (
    <section className={styles.section} aria-labelledby={`work-section-${index}`}>
      <p className={styles.sectionNumber} aria-hidden="true">0{index}</p>
      <div>
        <h2 className={styles.sectionTitle} id={`work-section-${index}`}>{title}</h2>
        <p className={styles.sectionCopy}>{children}</p>
      </div>
    </section>
  );
}
