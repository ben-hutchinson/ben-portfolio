import { DesktopShortcut, type DesktopShortcutAppId } from './DesktopShortcut';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { WindowLayer } from './WindowLayer';
import styles from './Desktop.module.css';

const SHORTCUT_APP_IDS: readonly DesktopShortcutAppId[] = ['about', 'career', 'work'];

export function Desktop() {
  const showShortcuts = useMediaQuery('(min-width: 768px) and (pointer: fine)');

  return (
    <div className={styles.desktop}>
      <p className={styles.backgroundStatement} aria-hidden="true">BUILD CLEAR PATHS</p>
      {showShortcuts ? (
        <div className={styles.shortcuts} aria-label="Desktop shortcuts">
          {SHORTCUT_APP_IDS.map((appId) => <DesktopShortcut appId={appId} key={appId} />)}
        </div>
      ) : null}
      <WindowLayer />
    </div>
  );
}
