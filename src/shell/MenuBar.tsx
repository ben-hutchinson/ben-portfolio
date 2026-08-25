import type { MouseEvent } from 'react';
import { usePortfolio } from '../app/PortfolioContext';
import { profile } from '../data/profile';
import { BrandMark } from './BrandMark';
import styles from './MenuBar.module.css';

function focusMainContent(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  document.getElementById('main-content')?.focus();
}

export function MenuBar() {
  const { state } = usePortfolio();
  const showDesktopIdentityHeading = state.route.kind === 'desktop';

  return (
    <>
      <a className={styles.skipLink} href="#main-content" onClick={focusMainContent}>Skip to main content</a>
      <div className={styles.menuBar}>
        <div className={styles.identity}>
          <BrandMark className={styles.mark} />
          <div>
            {showDesktopIdentityHeading ? (
              <h1 className={styles.name}>{profile.name}</h1>
            ) : (
              <p className={styles.name}>{profile.name}</p>
            )}
          </div>
        </div>

        <div className={styles.status}>
          <span className={styles.location}>{profile.location}</span>
        </div>
      </div>
    </>
  );
}
