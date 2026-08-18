import type { JSX } from 'react';
import { flagshipWork } from '../../data/work';
import { CaseStudySection } from './CaseStudySection';
import styles from './WorkApp.module.css';

export function WorkApp(): JSX.Element {
  return (
    <article className={styles.caseFile} aria-labelledby="work-title">
      <header className={styles.header}>
        <p className={styles.context}>{flagshipWork.context}</p>
        <h1 className={styles.title} id="work-title">{flagshipWork.title}</h1>
        <p className={styles.result}>{flagshipWork.result}</p>
      </header>

      <div className={styles.sections}>
        <CaseStudySection index={1} title="Problem">{flagshipWork.friction}</CaseStudySection>
        <CaseStudySection index={2} title="Ownership">{flagshipWork.ownership}</CaseStudySection>
        <CaseStudySection index={3} title="Approach">{flagshipWork.technicalApproach}</CaseStudySection>
        <CaseStudySection index={4} title="Rollout">{flagshipWork.rollout}</CaseStudySection>
        <CaseStudySection index={5} title="Outcome">
          The shared developer workflow became faster across the migrated repositories.
        </CaseStudySection>
      </div>

      <footer className={styles.boundary}>
        <h2>Public detail</h2>
        <p>{flagshipWork.publicDetail}</p>
      </footer>
    </article>
  );
}
