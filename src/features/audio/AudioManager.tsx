import { useEffect, useRef } from 'react';
import { audioAssetPath } from '../../utils/assets';

interface AudioManagerProps {
  enabled: boolean;
  muted: boolean;
}

export const AudioManager = ({ enabled, muted }: AudioManagerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    audioElement.muted = muted;

    if (!enabled) {
      audioElement.pause();
      audioElement.currentTime = 0;
      return;
    }

    const playPromise = audioElement.play();

    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay policies can block playback until user interaction.
      });
    }
  }, [enabled, muted]);

  return <audio ref={audioRef} src={audioAssetPath('chiptune-loop.mp3')} loop preload="none" />;
};
