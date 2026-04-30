import { motion } from 'framer-motion';
import type { CharacterProfile } from '../../data/types';
import { useChromaKeySprite } from '../../hooks/useChromaKeySprite';
import styles from './CharacterViewer.module.css';

interface CharacterViewerProps {
  character: CharacterProfile;
  reducedMotion: boolean;
}

export const CharacterViewer = ({ character, reducedMotion }: CharacterViewerProps) => {
  const currentFrame = character.assets.front;
  const processedFrame = useChromaKeySprite(currentFrame, character.spriteCleanup);

  const floatAnimation = reducedMotion
    ? { x: 0, y: 0, rotate: 0 }
    : {
        x: ['-18%', '22%', '12%', '-24%', '-18%'],
        y: ['-10%', '-22%', '18%', '8%', '-10%'],
        rotate: [-4, 5, -2, 4, -4],
      };

  const floatTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 15, repeat: Infinity, ease: 'linear' as const };

  return (
    <div className={styles.viewer}>
      <header className={styles.header}>
        <h2>{character.name}</h2>
        <p>{character.role}</p>
      </header>

      <motion.figure
        key={character.id}
        className={styles.stage}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 24, scale: reducedMotion ? 1 : 0.86 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: 'spring', damping: 18, stiffness: 180, mass: 1.05 }
        }
      >
        <div className={styles.starfield} aria-hidden="true" />
        <div className={styles.deepStars} aria-hidden="true" />
        <div className={styles.nebulaCloud} aria-hidden="true" />
        <div className={styles.planetHorizon} aria-hidden="true" />
        <div className={styles.particleDrift} aria-hidden="true" />
        <div className={styles.chamberRing} aria-hidden="true" />
        <div className={styles.chamberGlow} aria-hidden="true" />
        <div className={styles.glassSheen} aria-hidden="true" />

        <div
          className={styles.spriteArea}
          role="img"
          aria-label={`${character.name} front-facing sprite floating in the character selection bay.`}
        >
          <motion.div
            className={styles.spriteIntro}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.32, ease: 'easeOut' }
            }
          >
            <motion.div className={styles.spriteFloat} animate={floatAnimation} transition={floatTransition}>
              <img
                src={processedFrame}
                alt={`${character.name} front sprite`}
                className={styles.sprite}
                data-frame-src={currentFrame}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.figure>
    </div>
  );
};
