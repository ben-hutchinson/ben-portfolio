import { useState } from 'react';
import type { ProjectEntry } from '@/data/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { MissionCard } from './MissionCard';
import { ProjectBriefingSheet } from './ProjectBriefingSheet';
import styles from './MissionLogsSection.module.css';

interface MissionLogsSectionProps {
  id: string;
  projects: ProjectEntry[];
}

export const MissionLogsSection = ({ id, projects }: MissionLogsSectionProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-heading`}>
      <div className={styles.inner}>
        <h2 className={styles.sectionHeading} id={`${id}-heading`}>
          Mission logs.
        </h2>

        <div className={styles.missionList}>
          {featuredProjects.map((project, index) => (
            <MissionCard
              key={project.id}
              project={project}
              reducedMotion={reducedMotion}
              reveal={index === 0}
              setSelectedProjectId={setSelectedProjectId}
            />
          ))}
        </div>
      </div>

      {featuredProjects.map((project) => (
        <ProjectBriefingSheet
          key={project.id}
          project={project}
          open={selectedProjectId === project.id}
          onOpenChange={(open) => {
            if (!open) setSelectedProjectId(null);
          }}
        />
      ))}
    </section>
  );
};
