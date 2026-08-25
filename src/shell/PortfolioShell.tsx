import { Dock } from './Dock';
import { Desktop } from './Desktop';
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
          <Desktop />
        </main>
        <footer className={styles.footer}>
          <Dock />
        </footer>
        <LiveRegion />
      </div>
    </div>
  );
}
