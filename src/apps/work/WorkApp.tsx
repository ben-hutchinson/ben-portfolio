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

export function WorkApp(): JSX.Element {
  const { dispatch } = usePortfolio();

  return (
    <article className={styles.caseFile} aria-labelledby="work-title">
      {workItems.map((work, index) => {
        const featured = index === 0;
        const WorkTitle = featured ? 'h1' : 'h2';
        return (
          <section
            className={styles.catalogueEntry}
            data-featured={featured || undefined}
            data-testid={`work-entry-${work.id}`}
            key={work.id}
          >
            <header className={styles.header}>
              <p className={styles.index}>{`0${index + 1} / ${featured ? 'Featured case study' : 'Professional work'}`}</p>
              <p className={styles.context}>{work.context}</p>
              <WorkTitle className={styles.title} id={featured ? 'work-title' : undefined}>{work.title}</WorkTitle>
              <p className={styles.result}>{work.result}</p>
            </header>

            <div className={styles.sections}>
              {caseStudySections.map(({ title, field }, sectionIndex) => (
                <CaseStudySection idPrefix={work.id} index={sectionIndex + 1} key={field} title={title}>{work[field]}</CaseStudySection>
              ))}
            </div>

            <footer className={styles.boundary}>
              <h2>Public detail</h2>
              <p>{work.publicDetail}</p>
              <button
                className={styles.entryAction}
                type="button"
                aria-label={`Open ${work.title} case study`}
                onClick={() => dispatch({ type: 'SELECT_WORK', workId: work.id })}
              >
                Open case study <span aria-hidden="true">→</span>
              </button>
            </footer>
          </section>
        );
      })}
    </article>
  );
}
