import { useEffect, useState } from 'react';
import { DesktopShortcut, type DesktopShortcutAppId } from './DesktopShortcut';
import { WindowLayer } from './WindowLayer';
import styles from './Desktop.module.css';

const SHORTCUT_APP_IDS: readonly DesktopShortcutAppId[] = ['about', 'career', 'work'];

function supportsDesktopShortcuts(): boolean {
  return window.innerWidth >= 768;
}

export function Desktop() {
  const [showShortcuts, setShowShortcuts] = useState(supportsDesktopShortcuts);

  useEffect(() => {
    const updateVisibility = () => setShowShortcuts(supportsDesktopShortcuts());

    updateVisibility();
    window.addEventListener('resize', updateVisibility);
    return () => window.removeEventListener('resize', updateVisibility);
  }, []);

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
