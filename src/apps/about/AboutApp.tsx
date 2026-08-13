import { profile } from '../../data/profile';
import styles from './AboutApp.module.css';

export function AboutApp() {
  return (
    <article className={styles.about}>
      <p className={styles.identityLine}>{profile.role} · {profile.location}</p>
      <h2 className={styles.name}>{profile.name}</h2>
      <p className={styles.positioning}>{profile.positioning}</p>
      <p className={styles.supporting}>{profile.focus}</p>
    </article>
  );
}
