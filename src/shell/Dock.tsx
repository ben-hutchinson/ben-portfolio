import { usePortfolio } from '../app/PortfolioContext';
import type { AppId } from '../data/models';
import { externalLinks } from '../data/externalLinks';
import { UtilityIcon } from './UtilityIcon';
import styles from './Dock.module.css';

const apps: readonly { readonly label: string; readonly appId: AppId; readonly route?: 'work' | 'career' | 'projects' | 'contact' }[] = [
  { label: 'About', appId: 'about' },
  { label: 'Work', appId: 'work', route: 'work' },
  { label: 'Career', appId: 'career', route: 'career' },
  { label: 'Projects', appId: 'projects', route: 'projects' },
  { label: 'Contact', appId: 'contact', route: 'contact' },
];

const linkedIn = externalLinks[1];
const github = externalLinks[2];
export function Dock() {
  const { state, dispatch } = usePortfolio();
  const cvUrl = `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`;

  return (
    <nav className={styles.dock} aria-label="Portfolio applications">
      <div className={styles.apps}>
        {apps.map((app) => {
          const isActive = state.focusedAppId === app.appId;
          const onClick = () => {
            if (app.route) dispatch({ type: 'NAVIGATE', route: { kind: app.route } });
            else dispatch({ type: 'OPEN_APP', appId: app.appId });
          };
          return (
            <button
              className={styles.appButton}
              type="button"
              key={app.appId}
              onClick={onClick}
              aria-pressed={isActive}
              data-dock-app-id={app.appId}
            >
              {app.label}
            </button>
          );
        })}
      </div>
      <div className={styles.utilityLinks}>
        <a href={github.href} target="_blank" rel="noopener noreferrer"><UtilityIcon kind="github" />GitHub</a>
        <a href={linkedIn.href} target="_blank" rel="noopener noreferrer"><UtilityIcon kind="linkedin" />LinkedIn</a>
        <a href={cvUrl} download="ben-hutchinson-cv.pdf"><UtilityIcon kind="cv" />Download CV</a>
      </div>
    </nav>
  );
}
