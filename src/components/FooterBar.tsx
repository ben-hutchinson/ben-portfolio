import styles from './FooterBar.module.css';

interface FooterBarProps {
  muted: boolean;
  onToggleMute: () => void;
  cvHref: string;
}

const footerLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/ben-hutchinson0412/',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/ben-hutchinson',
  },
];

export const FooterBar = ({ muted, onToggleMute, cvHref }: FooterBarProps) => {
  return (
    <footer className={styles.footer}>
      <nav aria-label="External links" className={styles.linkGroup}>
        {footerLinks.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={styles.link}>
            {link.label}
          </a>
        ))}
        <a href={cvHref} target="_blank" rel="noreferrer" className={styles.link}>
          CV Download
        </a>
      </nav>

      <button
        type="button"
        className={styles.audioButton}
        onClick={onToggleMute}
        aria-pressed={muted}
        aria-label={muted ? 'Unmute background audio' : 'Mute background audio'}
      >
        {muted ? 'Audio: Muted' : 'Audio: On'}
      </button>
    </footer>
  );
};
