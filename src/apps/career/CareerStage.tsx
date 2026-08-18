import { m } from 'motion/react';
import type { JSX } from 'react';
import type { CareerStage as CareerStageData } from '../../data/models';
import styles from './CareerApp.module.css';

interface CareerStageProps {
  readonly stage: CareerStageData;
  readonly index: number;
  readonly reducedMotion: boolean;
}

const CAREER_STAGE_COUNT = 4;
const CAREER_MOTION_DURATION_MS = 200;
const CAREER_MOTION_OFFSET_PX = 0;

export function CareerStage({ stage, index, reducedMotion }: CareerStageProps): JSX.Element {
  const durationMs = reducedMotion ? 0 : CAREER_MOTION_DURATION_MS;

  return (
    <m.article
      className={styles.stage}
      data-testid="career-stage"
      data-reduced-motion={reducedMotion}
      data-motion-offset-px={CAREER_MOTION_OFFSET_PX}
      data-motion-duration-ms={durationMs}
      initial={{ opacity: reducedMotion ? 1 : 0.01 }}
      animate={{ opacity: 1 }}
      transition={{ duration: durationMs / 1000, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className={styles.stageLead}>
        <p className={styles.kicker}>
          <span>Stage {String(index + 1).padStart(2, '0')} / {String(CAREER_STAGE_COUNT).padStart(2, '0')}</span>
          <span>{stage.role}</span>
        </p>
        <p className={styles.year}>{stage.year}</p>
        <h3 className={styles.headline}>{stage.headline}</h3>
      </div>
      <aside className={styles.evidence} aria-label={`Evidence for ${stage.role}`}>
        <p className={styles.evidenceLabel}>Evidence</p>
        <p className={styles.evidenceStatement}>{stage.evidence}</p>
        <p className={styles.description}>{stage.description}</p>
      </aside>
    </m.article>
  );
}
