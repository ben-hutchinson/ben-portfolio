import { CommandButton } from '@/components/CommandButton';
import styles from './TrainingModule.module.css';

export interface TrainingModuleProps {
  onLaunch: () => void;
}

export const TrainingModule = ({ onLaunch }: TrainingModuleProps) => (
  <section className={styles.section} id="training">
    <div className={styles.inner}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Optional training / Signal Sprint</p>
        <h2>Put the command reflexes to work.</h2>
        <p>
          Launch a short side-scrolling simulation. Clear incoming obstacles and set a new
          mission best.
        </p>
      </div>
      <div className={styles.actionPanel}>
        <span aria-hidden="true" className={styles.signal} />
        <p>Simulation ready</p>
        <CommandButton onClick={onLaunch} variant="primary">
          Launch Signal Sprint
        </CommandButton>
      </div>
    </div>
  </section>
);
