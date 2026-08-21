import type { JSX } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import type { WorkCaseStudy } from '../../data/models';
import { workItems } from '../../data/work';
import { CaseStudySection } from './CaseStudySection';
import styles from './WorkApp.module.css';

const caseStudySections: readonly { readonly title: 'Problem' | 'Ownership' | 'Approach' | 'Rollout' | 'Outcome'; readonly field: keyof Pick<
  WorkCaseStudy,
  'friction' | 'ownership' | 'technicalApproach' | 'rollout' | 'outcome'
> }[] = [
  { title: 'Problem', field: 'friction' },
  { title: 'Ownership', field: 'ownership' },
  { title: 'Approach', field: 'technicalApproach' },
  { title: 'Rollout', field: 'rollout' },
  { title: 'Outcome', field: 'outcome' },
];

export function WorkDetailApp(): JSX.Element | null {
  const { state, dispatch } = usePortfolio();
  const work = workItems.find(({ id }) => id === state.activeWorkId);
  if (work === undefined) return null;

  return (
    <article className={styles.detail} aria-labelledby="work-detail-title" data-work-detail={work.id}>
      <button
        className={styles.back}
        type="button"
        aria-label="Back to work"
        onClick={() => dispatch({ type: 'OPEN_APP', appId: 'work' })}
      >
        ← Back to work
      </button>
      <header className={styles.header}>
        <p className={styles.context}>{work.context}</p>
        <h1 className={styles.title} id="work-detail-title">{work.title}</h1>
        <p className={styles.result}>{work.result}</p>
      </header>

      <div className={styles.sections}>
        {caseStudySections.map(({ title, field }, index) => (
          <CaseStudySection idPrefix={work.id} index={index + 1} key={field} title={title}>{work[field]}</CaseStudySection>
        ))}
      </div>

      <footer className={styles.boundary}>
        <h2>Public detail</h2>
        <p>{work.publicDetail}</p>
      </footer>
    </article>
  );
}
