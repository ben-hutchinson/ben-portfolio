import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { CommandButton } from '@/components/CommandButton';
import { profile } from '@/data/profile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { revealViewport, sectionReveal } from '@/lib/motion';
import styles from './HeroSection.module.css';

export interface HeroSectionProps {
  benHeroSrc: string;
}

export const HeroSection = ({ benHeroSrc }: HeroSectionProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, { amount: 0.2 });

  return (
    <m.section
      className={styles.hero}
      data-ambient-active={heroInView && !reducedMotion}
      id="top"
      initial="hidden"
      ref={heroRef}
      variants={sectionReveal(reducedMotion)}
      viewport={revealViewport}
      whileInView="visible"
    >
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            {profile.role} <span aria-hidden="true">·</span> {profile.location}
          </p>
          <h1 className={styles.headline}>{profile.headline}</h1>
          <p className={styles.summary}>{profile.summary}</p>
          <div className={styles.actions}>
            <CommandButton href="#work" variant="primary">
              Explore mission logs
            </CommandButton>
            <CommandButton href="#experience">View experience</CommandButton>
          </div>
          <ul className={styles.proof} aria-label="Core engineering capabilities">
            {profile.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.observationWindow}>
          <div className={styles.windowHeader}>
            <span>Observation 01</span>
            <span className={styles.online}>
              <span aria-hidden="true" />
              Online
            </span>
          </div>
          <div className={styles.portraitFrame}>
            <div className={styles.orbit} aria-hidden="true" />
            <div className={styles.orbitSecondary} aria-hidden="true" />
            <img
              className={styles.portrait}
              src={benHeroSrc}
              alt="Ben Hutchinson in command crew uniform"
            />
            <span className={styles.reticle} aria-hidden="true" />
          </div>
          <div className={styles.telemetry} aria-hidden="true">
            <span>Operator BH-01</span>
            <span>53.4808° N</span>
            <span>2.2426° W</span>
          </div>
        </div>
      </div>
    </m.section>
  );
};
