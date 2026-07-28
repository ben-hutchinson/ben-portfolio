import type { TimelineEvent } from '@/data/types';
import styles from './ExperienceTimeline.module.css';

interface ExperienceTimelineProps {
  id: string;
  events: TimelineEvent[];
}

export const ExperienceTimeline = ({ id, events }: ExperienceTimelineProps) => (
  <section className={styles.section} id={id} aria-labelledby={`${id}-heading`}>
    <div className={styles.inner}>
      <h2 className={styles.sectionHeading} id={`${id}-heading`}>
        Experience with operating context.
      </h2>
      <ol className={styles.timeline}>
        {events.map((event) => (
          <li className={styles.event} key={`${event.year}-${event.title}`}>
            {event.year ? <time>{event.year}</time> : null}
            <div className={styles.eventCopy}>
              <h3>{event.title}</h3>
              {event.description ? <p>{event.description}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
