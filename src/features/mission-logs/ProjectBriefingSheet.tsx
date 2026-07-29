import type { RefObject } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { ProjectEntry } from '@/data/types';
import styles from './MissionLogsSection.module.css';

interface ProjectBriefingSheetProps {
  project: ProjectEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalFocusRef: RefObject<HTMLElement | null>;
}

export const ProjectBriefingSheet = ({
  project,
  open,
  onOpenChange,
  finalFocusRef,
}: ProjectBriefingSheetProps) => {
  const { briefing } = project;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={styles.sheet} finalFocus={finalFocusRef}>
        <SheetHeader className={styles.sheetHeader}>
          <SheetTitle className={styles.sheetTitle}>
            {project.title} engineering briefing
          </SheetTitle>
          <SheetDescription className={styles.sheetDescription}>
            {project.blurb}
          </SheetDescription>
        </SheetHeader>

        <Separator className={styles.separator} />

        <div className={styles.briefingBody}>
          {briefing?.context ? (
            <section>
              <h2>Context</h2>
              <p>{briefing.context}</p>
            </section>
          ) : null}

          {briefing?.constraint ? (
            <section>
              <h2>Constraint</h2>
              <p>{briefing.constraint}</p>
            </section>
          ) : null}

          {briefing?.responsibilities.length ? (
            <section>
              <h2>Responsibilities</h2>
              <ul>
                {briefing.responsibilities.map((responsibility) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {briefing?.decisions.length ? (
            <section>
              <h2>Key decisions</h2>
              <ul>
                {briefing.decisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.systemShape?.length ? (
            <section>
              <h2>System shape</h2>
              <ul className={styles.briefingTags}>
                {project.systemShape.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {briefing?.delivery ? (
            <section>
              <h2>Delivery and operations</h2>
              <p>{briefing.delivery}</p>
            </section>
          ) : null}

          {briefing?.outcome ? (
            <section>
              <h2>Outcome or learning</h2>
              <p>{briefing.outcome}</p>
            </section>
          ) : null}

          {project.links.length ? (
            <section>
              <h2>Links</h2>
              <ul className={styles.briefingLinks}>
                {project.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a href={link.href} rel="noreferrer" target="_blank">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
};
