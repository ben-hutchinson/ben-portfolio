import { usePortfolio } from '../app/PortfolioContext';
import { profile } from '../data/profile';
import styles from './MenuBar.module.css';

const menuItems = [
  { label: 'Desktop', href: '#desktop', route: 'desktop' },
  { label: 'Work', href: '#work', route: 'work' },
  { label: 'Career', href: '#career', route: 'career' },
  { label: 'Projects', href: '#projects', route: 'projects' },
] as const;

function isCurrentRoute(routeKind: string, menuRoute: string): boolean {
  return routeKind === menuRoute || (routeKind === 'project' && menuRoute === 'projects');
}

function focusMainContent() {
  document.getElementById('main-content')?.focus();
}

export function MenuBar() {
  const { state } = usePortfolio();

  return (
    <>
      <a className={styles.skipLink} href="#main-content" onClick={focusMainContent}>Skip to main content</a>
      <div className={styles.menuBar}>
        <div className={styles.identity}>
          <span className={styles.mark} aria-hidden="true">BH</span>
          <div>
            <p className={styles.name}>{profile.name}</p>
            <p className={styles.role}>{profile.role}</p>
          </div>
        </div>

        <nav className={styles.navigation} aria-label="Primary navigation">
          {menuItems.map((item) => (
            <a
              className={styles.navLink}
              href={item.href}
              key={item.href}
              aria-current={isCurrentRoute(state.route.kind, item.route) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.status}>
          <span className={styles.location}>Manchester, UK</span>
          <span className={styles.availability}><span aria-hidden="true" className={styles.statusDot} />{profile.availability}</span>
        </div>
      </div>
    </>
  );
}
