import { useEffect, useState } from 'react';
import styles from './IntroScreen.module.css';

interface IntroScreenProps {
  onStart: (rememberSkip: boolean) => void;
  initialRememberSkip: boolean;
}

export const IntroScreen = ({ onStart, initialRememberSkip }: IntroScreenProps) => {
  const [rememberSkip, setRememberSkip] = useState(initialRememberSkip);

  useEffect(() => {
    setRememberSkip(initialRememberSkip);
  }, [initialRememberSkip]);

  return (
    <section className={styles.intro} aria-label="Press start screen">
      <h1 className={styles.title}>
        <span>BEN</span>
        <span>HUTCHINSON</span>
      </h1>

      <button type="button" className={styles.startButton} onClick={() => onStart(rememberSkip)}>
        PRESS START
      </button>

      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={rememberSkip}
          onChange={(event) => setRememberSkip(event.target.checked)}
        />
        Skip intro next time
      </label>
    </section>
  );
};
