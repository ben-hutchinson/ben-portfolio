import { profile } from '../data/profile';
import { flagshipWork } from '../data/work';
import { Dock } from './Dock';
import { LiveRegion } from './LiveRegion';
import { MenuBar } from './MenuBar';
import styles from './PortfolioShell.module.css';

export function PortfolioShell() {
  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <header className={styles.header}>
          <MenuBar />
        </header>
        <main className={styles.main} id="main-content" tabIndex={-1}>
          <p className={styles.backgroundStatement} aria-hidden="true">BUILD CLEAR PATHS</p>
          <section className={styles.summary} aria-labelledby="portfolio-summary-title">
            <p className={styles.utilityStrip}>Portfolio OS / available for the next useful problem</p>
            <div className={styles.summaryContent}>
              <p className={styles.eyebrow}>Platform engineering portfolio</p>
              <h1 id="portfolio-summary-title">{profile.name}</h1>
              <p className={styles.positioning}>{profile.positioning}</p>
              <p className={styles.location}>{profile.availability}</p>
              <p className={styles.result}>{flagshipWork.result}</p>
              <div className={styles.summaryActions}>
                <a href="#work">Explore work</a>
                <a href="#career">See career</a>
              </div>
            </div>
          </section>
        </main>
        <footer className={styles.footer}>
          <Dock />
        </footer>
        <LiveRegion />
      </div>
    </div>
  );
}
