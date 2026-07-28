import { m } from 'framer-motion';
import type { ProjectEntry } from '@/data/types';
import { revealViewport, sectionReveal } from '@/lib/motion';
import styles from './MissionLogsSection.module.css';

interface MissionCardProps {
  project: ProjectEntry;
  reducedMotion: boolean;
  reveal: boolean;
  setSelectedProjectId: (projectId: string) => void;
}

const imageDimensions: Record<string, { height: number; width: number }> = {
  pokeleximon: { height: 1574, width: 3446 },
  safelog: { height: 1406, width: 3376 },
};

const fallbackImageDimensions = { height: 900, width: 1600 };

export const MissionCard = ({
  project,
  reducedMotion,
  reveal,
  setSelectedProjectId,
}: MissionCardProps) => {
  const dimensions = imageDimensions[project.id] ?? fallbackImageDimensions;
  const hoverVariant = reducedMotion ? undefined : 'hover';
  const cardVariants = reveal
    ? { ...sectionReveal(reducedMotion), hover: { y: -2 } }
    : { hover: { y: -2 } };

  return (
    <m.article
      className={styles.card}
      initial={reveal ? 'hidden' : undefined}
      variants={cardVariants}
      viewport={reveal ? revealViewport : undefined}
      whileHover={hoverVariant}
      whileInView={reveal ? 'visible' : undefined}
    >
      {project.image ? (
        <div className={styles.imageFrame}>
          <m.img
            alt={`${project.title} project screenshot`}
            className={styles.projectImage}
            height={dimensions.height}
            loading="lazy"
            src={project.image}
            variants={{ hover: { scale: 1.025 } }}
            width={dimensions.width}
          />
        </div>
      ) : null}

      <div className={styles.cardCopy}>
        {project.category ? <p className={styles.category}>{project.category}</p> : null}
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.blurb}>{project.blurb}</p>

        {project.systemShape?.length ? (
          <div className={styles.cardBlock}>
            <h4>System shape</h4>
            <ul className={styles.tagList}>
              {project.systemShape.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.engineeringStory ? (
          <div className={styles.cardBlock}>
            <h4>Engineering story</h4>
            <p>{project.engineeringStory}</p>
          </div>
        ) : null}

        {project.links.length ? (
          <ul className={styles.previewLinks} aria-label={`${project.title} links`}>
            {project.links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a href={link.href} rel="noreferrer" target="_blank">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <button
          className={styles.openButton}
          type="button"
          aria-label={`Open ${project.title} engineering briefing`}
          onClick={() => setSelectedProjectId(project.id)}
        >
          Open engineering briefing
        </button>
      </div>
    </m.article>
  );
};
