import type { AppId } from '../data/models';
import { usePortfolio } from '../app/PortfolioContext';
import styles from './Desktop.module.css';

export type DesktopShortcutAppId = Extract<AppId, 'about' | 'career' | 'work'>;

const shortcutPresentation: Readonly<Record<DesktopShortcutAppId, {
  readonly label: string;
  readonly fileName: string;
  readonly glyph: string;
}>> = {
  about: { label: 'About', fileName: 'ABOUT.BEN', glyph: 'i' },
  career: { label: 'Career', fileName: 'CAREER.APP', glyph: '↗' },
  work: { label: 'Work', fileName: 'WORK.SYS', glyph: '◆' },
};

export function DesktopShortcut({ appId }: { readonly appId: DesktopShortcutAppId }) {
  const { dispatch } = usePortfolio();
  const shortcut = shortcutPresentation[appId];

  return (
    <button
      className={styles.shortcut}
      type="button"
      aria-label={`Open ${shortcut.label}`}
      data-desktop-shortcut-app-id={appId}
      onClick={() => dispatch({ type: 'OPEN_APP', appId })}
    >
      <span className={styles.shortcutTile} aria-hidden="true">{shortcut.glyph}</span>
      <span className={styles.shortcutName} aria-hidden="true">{shortcut.fileName}</span>
    </button>
  );
}
