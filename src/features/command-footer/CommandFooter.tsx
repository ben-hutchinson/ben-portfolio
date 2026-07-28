import { cvAssetPath } from '@/utils/assets';
import styles from './CommandFooter.module.css';

const footerLinks = [
  {
    href: 'https://github.com/ben-hutchinson',
    label: 'GitHub',
    external: true,
  },
  {
    href: 'https://www.linkedin.com/in/ben-hutchinson0412/',
    label: 'LinkedIn',
    external: true,
  },
  {
    href: cvAssetPath('ben-hutchinson-cv.pdf'),
    label: 'Download CV',
    external: false,
  },
] as const;

export const CommandFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.signoff}>
        <span className={styles.status}>
          <span aria-hidden="true" />
          Channel open
        </span>
        <p>Build the calm. Own the outcome.</p>
      </div>
      <nav aria-label="Contact and profile links">
        <ul className={styles.links}>
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                rel={link.external ? 'noreferrer' : undefined}
                target={link.external ? '_blank' : undefined}
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className={styles.meta}>Ben Hutchinson · Manchester, UK</p>
    </div>
  </footer>
);
