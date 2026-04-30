import { useEffect, useState } from 'react';
import { clamp } from '../../utils/math';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  durationMs: number;
  reducedMotion: boolean;
  title?: string;
}

export const LoadingScreen = ({
  durationMs,
  reducedMotion,
  title = 'Loading Character Select...',
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(2);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      return;
    }

    const intervalMs = 55;
    const increment = (100 * intervalMs) / durationMs;

    const interval = window.setInterval(() => {
      setProgress((current) => clamp(current + increment, 0, 100));
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [durationMs, reducedMotion]);

  return (
    <section className={styles.loading} aria-label="Loading transition screen">
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.track} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className={styles.bar} style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.label}>{Math.round(progress)}%</p>
    </section>
  );
};
