import { m } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { revealViewport, sectionReveal } from '@/lib/motion';
import styles from './CrewSection.module.css';

export interface CrewMember {
  id: 'ben' | 'dog' | 'cat';
  name: string;
  heroSrc: string;
  assignment: string;
  callSign: string;
}

export interface CrewSectionProps {
  members: CrewMember[];
}

export const CrewSection = ({ members }: CrewSectionProps) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <m.section
      className={styles.section}
      id="crew"
      initial="hidden"
      variants={sectionReveal(reducedMotion)}
      viewport={revealViewport}
      whileInView="visible"
    >
      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Command crew / 03</p>
          <h2>Meet the operators</h2>
          <p>
            One engineer, two uncompromising quality controls. Professional
            ownership with a little operational character.
          </p>
        </header>

        <div className={styles.grid}>
          {members.map((member, index) => (
            <article
              className={styles.card}
              key={member.id}
              aria-labelledby={`crew-${member.id}`}
            >
              <div className={styles.imageFrame}>
                <span className={styles.index} aria-hidden="true">
                  0{index + 1}
                </span>
                <img
                  className={styles.portrait}
                  src={member.heroSrc}
                  alt={`${member.name}, ${member.assignment}`}
                />
              </div>
              <div className={styles.cardCopy}>
                <p className={styles.callSign}>Call sign / {member.callSign}</p>
                <h3 id={`crew-${member.id}`}>{member.name}</h3>
                <p className={styles.assignment}>{member.assignment}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </m.section>
  );
};
