import type { JSX } from 'react';
import { externalLinks } from '../../data/externalLinks';
import { profile } from '../../data/profile';
import styles from './ContactApp.module.css';

export function ContactApp(): JSX.Element {
  const cvUrl = `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`;
  return (
    <article className={styles.contact} aria-labelledby="contact-title">
      <header className={styles.header}>
        <p>Direct line / Manchester</p>
        <h1 id="contact-title">Contact Ben</h1>
        <p>{profile.availability}</p>
      </header>
      <dl className={styles.details}>
        <div><dt>Location</dt><dd>{profile.location}</dd></div>
        <div><dt>Status</dt><dd>{profile.availability}</dd></div>
      </dl>
      <nav className={styles.actions} aria-label="Contact and profile links">
        {externalLinks.map((link) => (
          <a
            href={link.href}
            target={link.href.startsWith('https://') ? '_blank' : undefined}
            rel={link.href.startsWith('https://') ? 'noreferrer noopener' : undefined}
            key={link.label}
          >{link.label}<span aria-hidden="true"> ↗</span></a>
        ))}
        <a href={cvUrl} download="ben-hutchinson-cv.pdf">Download CV <span aria-hidden="true">↓</span></a>
      </nav>
    </article>
  );
}
