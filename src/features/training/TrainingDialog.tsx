import { lazy, Suspense, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { characters } from '@/data/characters';
import { AudioManager } from '@/features/audio/AudioManager';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './TrainingModule.module.css';

export interface TrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LazyMissionRunner = lazy(() =>
  import('../mission-runner/MissionRunner').then(({ MissionRunner }) => ({
    default: MissionRunner,
  })),
);

interface TrainingExperienceProps {
  reducedMotion: boolean;
  onExit: () => void;
}

const TrainingExperience = ({ reducedMotion, onExit }: TrainingExperienceProps) => {
  const [persistedMuted, setPersistedMuted] = useLocalStorage<boolean>('portfolio.muted', true);
  const [audioInteracted, setAudioInteracted] = useState(false);
  const sessionMuted = audioInteracted ? persistedMuted : true;

  const handleAudioControl = () => {
    if (!audioInteracted) {
      setAudioInteracted(true);

      if (persistedMuted) {
        setPersistedMuted(false);
      }

      return;
    }

    setPersistedMuted((currentMuted) => !currentMuted);
  };

  const audioLabel = !audioInteracted
    ? 'Enable training audio'
    : sessionMuted
      ? 'Unmute training audio'
      : 'Mute training audio';

  return (
    <>
      <AudioManager enabled={audioInteracted} muted={sessionMuted} />
      <button
        aria-label={audioLabel}
        aria-pressed={audioInteracted && !sessionMuted}
        className={styles.audioControl}
        onClick={handleAudioControl}
        type="button"
      >
        {audioInteracted && !sessionMuted ? 'Audio on' : 'Audio off'}
      </button>
      <LazyMissionRunner
        character={characters[0]}
        reducedMotion={reducedMotion}
        onExit={onExit}
      />
    </>
  );
};

export const TrainingDialog = ({ open, onOpenChange }: TrainingDialogProps) => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <DialogContent
        aria-describedby="signal-sprint-description"
        className={styles.dialogContent}
      >
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>
            Signal Sprint training simulation
          </DialogTitle>
          <DialogDescription className={styles.dialogDescription} id="signal-sprint-description">
            Jump with Space, Arrow Up, W, or a pointer press. Avoid incoming obstacles.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <Suspense fallback={<p className={styles.loading}>Preparing Signal Sprint…</p>}>
            <TrainingExperience
              reducedMotion={reducedMotion}
              onExit={() => onOpenChange(false)}
            />
          </Suspense>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
