import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type {
  CharacterProfile,
  ProjectEntry,
  SectionId,
  SkillCategory,
  TimelineEvent,
} from '../../data/types';
import styles from './ContentPanel.module.css';

interface ContentPanelProps {
  selectedCharacter: CharacterProfile;
  activeSection: SectionId;
  timelineEvents: TimelineEvent[];
  skillCategories: SkillCategory[];
  projects: ProjectEntry[];
  reducedMotion: boolean;
}

const transitionFor = (reducedMotion: boolean) => ({
  duration: reducedMotion ? 0 : 0.26,
  ease: reducedMotion ? 'linear' : 'easeOut',
});

export const ContentPanel = ({
  selectedCharacter,
  activeSection,
  timelineEvents,
  skillCategories,
  projects,
  reducedMotion,
}: ContentPanelProps) => {
  const [projectFilter, setProjectFilter] = useState<'personal' | 'work'>('personal');
  const showProjectToggle = selectedCharacter.id === 'ben';
  const displayTimelineEvents = selectedCharacter.timelineEvents ?? timelineEvents;
  const displaySkillCategories = selectedCharacter.skillCategories ?? skillCategories;
  const displayProjects = selectedCharacter.projects ?? projects;

  const filteredProjects = useMemo(() => {
    if (!showProjectToggle) {
      return displayProjects;
    }

    return displayProjects.filter((project) => project.kind === projectFilter);
  }, [displayProjects, projectFilter, showProjectToggle]);

  return (
    <div className={styles.panelFrame}>
      <AnimatePresence mode="wait">
        <motion.section
          key={`${selectedCharacter.id}-${activeSection}`}
          className={styles.section}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
          transition={transitionFor(reducedMotion)}
        >
          <header className={styles.sectionHeader}>
            <h3>{selectedCharacter.panelLabels[activeSection]}</h3>
          </header>

          {activeSection === 'about' && (
            <article className={styles.aboutBody}>
              {(selectedCharacter.aboutParagraphs ?? [
                'I care about shipping experiences that look intentional, feel responsive, and remain easy to maintain long term.',
                'This portfolio is intentionally game-inspired, but every piece is production-minded: semantic structure, keyboard navigation, reduced-motion support, and deploy-ready build tooling.',
              ]).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          )}

          {activeSection === 'career' && (
            <ol className={styles.timeline}>
              {displayTimelineEvents.map((event) => (
                <li key={`${event.year ?? 'stage'}-${event.title}`}>
                  {event.year && <span className={styles.year}>{event.year}</span>}
                  <h4>{event.title}</h4>
                  {event.currentPosition && <p className={styles.position}>{event.currentPosition}</p>}
                  {event.description && <p>{event.description}</p>}
                </li>
              ))}
            </ol>
          )}

          {activeSection === 'skills' && (
            <div className={styles.skillsGrid}>
              {displaySkillCategories.map((category) => (
                <section key={category.id} className={styles.skillCard}>
                  <h4>{category.label}</h4>
                  <ul>
                    {category.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {activeSection === 'projects' && (
            <div className={styles.projectsSection}>
              {showProjectToggle && (
                <div className={styles.projectToggle} role="tablist" aria-label="Project category">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={projectFilter === 'personal'}
                    className={`${styles.toggleButton} ${projectFilter === 'personal' ? styles.toggleActive : ''}`.trim()}
                    onClick={() => setProjectFilter('personal')}
                  >
                    Personal
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={projectFilter === 'work'}
                    className={`${styles.toggleButton} ${projectFilter === 'work' ? styles.toggleActive : ''}`.trim()}
                    onClick={() => setProjectFilter('work')}
                  >
                    Work
                  </button>
                </div>
              )}

              <div className={styles.projectsGrid}>
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className={`${styles.projectCard} ${project.image ? '' : styles.textOnlyProject}`.trim()}
                  >
                    {project.image && (
                      <img src={project.image} alt={`${project.title} screenshot`} className={styles.projectImage} />
                    )}
                    <div className={styles.projectBody}>
                      <h4>{project.title}</h4>
                      <p>{project.blurb}</p>
                      {project.tags.length > 0 && (
                        <ul className={styles.tagRow}>
                          {project.tags.map((tag) => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      )}
                      {project.links.length > 0 && (
                        <div className={styles.linkRow}>
                          {project.links.map((link) => (
                            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <article className={styles.projectCard}>
                  <div className={styles.projectBody}>
                    <h4>No {projectFilter} projects yet</h4>
                    <p>Add entries in `src/data/projects.ts` with `kind: "{projectFilter}"`.</p>
                  </div>
                </article>
              )}
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
};
