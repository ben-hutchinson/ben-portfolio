import { useEffect, useRef, useState, type JSX } from 'react';
import type { Project } from '../data/models';
import styles from './ProjectTrailer.module.css';

export function ProjectTrailer({ project }: { readonly project: Project }): JSX.Element | null {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const player = videoRef.current;
    return () => player?.pause();
  }, []);

  const trailer = project.trailer;
  if (trailer === undefined) return null;
  const titleId = `project-trailer-${project.id}`;
  const transcriptId = `${titleId}-transcript`;

  return (
    <section className={styles.trailer} aria-labelledby={titleId}>
      <h2 id={titleId}>Project trailer</h2>
      <div className={styles.frame}>
        {failed ? (
          <p className={styles.fallback} role="status">
            Trailer unavailable. You can still explore the gameplay screenshot and read the transcript below.
          </p>
        ) : (
          <video
            className={styles.video}
            ref={videoRef}
            aria-label={`${project.title} trailer`}
            aria-describedby={transcriptId}
            controls
            playsInline
            preload="none"
            tabIndex={0}
            src={`${import.meta.env.BASE_URL}${trailer.src}`}
            poster={`${import.meta.env.BASE_URL}${trailer.poster}`}
            onError={() => setFailed(true)}
          >
            <track
              kind="captions"
              srcLang="en"
              label="English"
              src={`${import.meta.env.BASE_URL}${trailer.captions}`}
              default
            />
            Your browser does not support native video playback. Read the transcript below.
          </video>
        )}
      </div>
      <div className={styles.transcript}>
        <h3>Descriptive transcript</h3>
        <p id={transcriptId}>{trailer.description}</p>
      </div>
    </section>
  );
}
