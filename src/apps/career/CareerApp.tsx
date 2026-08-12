import { useReducedMotion } from 'motion/react';
import type { JSX } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import { careerStages } from '../../data/career';
import { CAREER_DIRECT_LABELS, CareerControls } from './CareerControls';
import { CareerStage } from './CareerStage';
import styles from './CareerApp.module.css';

export function CareerApp(): JSX.Element {
  const { state, dispatch } = usePortfolio();
  const motionPreference = useReducedMotion();
  const reducedMotion = motionPreference === true
    || (typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const derivedIndex = careerStages.findIndex((stage) => stage.id === state.activeCareerStageId);
  const activeIndex = derivedIndex >= 0 ? derivedIndex : 0;
  const activeStage = careerStages[activeIndex];
  const directLabel = CAREER_DIRECT_LABELS[activeIndex] ?? CAREER_DIRECT_LABELS[0];
  const stageLabel = `${directLabel} — ${activeStage.role}`;

  return (
    <section className={styles.app} data-accent={activeStage.accent} aria-label="Career timeline">
      <h1 className={styles.mobileHeading}>Career</h1>
      <CareerStage
        stage={activeStage}
        index={activeIndex}
        reducedMotion={reducedMotion}
        key={activeStage.id}
      />
      <CareerControls
        activeIndex={activeIndex}
        stageLabel={stageLabel}
        onStageChange={(index) => {
          const stage = careerStages[index];
          if (stage !== undefined) dispatch({ type: 'SELECT_CAREER_STAGE', stageId: stage.id });
        }}
        classNames={{
          controls: styles.controls,
          count: styles.count,
          range: styles.range,
          directControls: styles.directControls,
          directControl: styles.directControl,
        }}
      />
      <p
        className={styles.status}
        role="status"
        aria-label="Current career stage"
        aria-live="polite"
        aria-atomic="true"
      >
        {stageLabel}
      </p>
    </section>
  );
}
