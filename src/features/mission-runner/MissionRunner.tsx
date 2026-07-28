import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, PointerEvent } from 'react';
import type { CharacterProfile } from '../../data/types';
import { useChromaKeySprite } from '../../hooks/useChromaKeySprite';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { clamp } from '../../utils/math';
import styles from './MissionRunner.module.css';

interface MissionRunnerProps {
  character: CharacterProfile;
  reducedMotion: boolean;
  onExit: () => void;
}

type RunnerStatus = 'ready' | 'running' | 'gameOver';

interface Obstacle {
  id: number;
  x: number;
  width: number;
  height: number;
  tone: 'cyan' | 'purple' | 'warm';
}

interface RunnerSnapshot {
  status: RunnerStatus;
  y: number;
  velocity: number;
  distance: number;
  speed: number;
  score: number;
  obstacles: Obstacle[];
}

const WORLD_WIDTH = 960;
const GROUND_Y = 286;
const PLAYER_X = 132;
const PLAYER_WIDTH = 78;
const PLAYER_HEIGHT = 90;
const PLAYER_HITBOX_INSET_X = 20;
const PLAYER_HITBOX_TOP_INSET = 14;
const BASE_SPEED = 265;
const MAX_SPEED = 520;
const GRAVITY = 1820;
const JUMP_VELOCITY = 720;
const SCORE_UNIT = 14;

const obstacleTones: Obstacle['tone'][] = ['cyan', 'purple', 'warm'];

const createInitialSnapshot = (status: RunnerStatus = 'ready'): RunnerSnapshot => ({
  status,
  y: 0,
  velocity: 0,
  distance: 0,
  speed: BASE_SPEED,
  score: 0,
  obstacles: [],
});

const randomGap = (speed: number): number => 300 + Math.random() * 180 + clamp(speed - BASE_SPEED, 0, 180) * 0.28;

const createObstacle = (id: number): Obstacle => {
  const tall = Math.random() > 0.62;

  return {
    id,
    x: WORLD_WIDTH + 42,
    width: tall ? 34 : 44,
    height: tall ? 72 : 48,
    tone: obstacleTones[id % obstacleTones.length],
  };
};

const hasCollision = (snapshot: RunnerSnapshot): boolean => {
  const playerLeft = PLAYER_X + PLAYER_HITBOX_INSET_X;
  const playerRight = PLAYER_X + PLAYER_WIDTH - PLAYER_HITBOX_INSET_X;
  const playerBottom = GROUND_Y - snapshot.y;
  const playerTop = playerBottom - PLAYER_HEIGHT + PLAYER_HITBOX_TOP_INSET;

  return snapshot.obstacles.some((obstacle) => {
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + obstacle.width;
    const obstacleBottom = GROUND_Y;
    const obstacleTop = obstacleBottom - obstacle.height;

    return (
      playerRight > obstacleLeft &&
      playerLeft < obstacleRight &&
      playerBottom > obstacleTop &&
      playerTop < obstacleBottom
    );
  });
};

export const MissionRunner = ({ character, reducedMotion, onExit }: MissionRunnerProps) => {
  const [bestScore, setBestScore] = useLocalStorage<number>('portfolio.runnerBestScore', 0);
  const [snapshot, setSnapshot] = useState<RunnerSnapshot>(() => createInitialSnapshot());
  const playfieldRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef(snapshot);
  const rafRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const nextObstacleIdRef = useRef(1);
  const nextGapRef = useRef(randomGap(BASE_SPEED));

  const runFrames = useMemo(() => {
    return character.assets.runnerRunFrames?.length
      ? character.assets.runnerRunFrames
      : [character.assets.runnerStill ?? character.assets.front];
  }, [character.assets.front, character.assets.runnerRunFrames, character.assets.runnerStill]);

  const isGrounded = snapshot.y <= 1;
  const frameMs = character.assets.runnerFrameMs ?? 115;
  const frameSource =
    !isGrounded || snapshot.status === 'gameOver'
      ? character.assets.runnerStill ?? runFrames[0]
      : runFrames[Math.floor((snapshot.distance / Math.max(frameMs, 1)) * 3) % runFrames.length];
  const processedFrame = useChromaKeySprite(frameSource, character.spriteCleanup);

  const commitSnapshot = useCallback((nextSnapshot: RunnerSnapshot) => {
    snapshotRef.current = nextSnapshot;
    setSnapshot(nextSnapshot);
  }, []);

  const resetGame = useCallback(
    (status: RunnerStatus = 'ready') => {
      lastFrameTimeRef.current = 0;
      nextObstacleIdRef.current = 1;
      nextGapRef.current = randomGap(BASE_SPEED);
      commitSnapshot(createInitialSnapshot(status));
    },
    [commitSnapshot],
  );

  const startRun = useCallback(() => {
    const current = snapshotRef.current;

    if (current.status !== 'running') {
      lastFrameTimeRef.current = 0;
      commitSnapshot({ ...current, status: 'running' });
    }
  }, [commitSnapshot]);

  const jump = useCallback(() => {
    const current = snapshotRef.current;

    if (current.status === 'gameOver') {
      return;
    }

    if (current.status === 'ready') {
      lastFrameTimeRef.current = 0;
    }

    if (current.y <= 1) {
      commitSnapshot({
        ...current,
        status: 'running',
        y: 0,
        velocity: JUMP_VELOCITY,
      });
    }
  }, [commitSnapshot]);

  const handleRetry = useCallback(() => {
    resetGame('running');
  }, [resetGame]);

  const handlePlayfieldPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    playfieldRef.current?.focus();

    if ((event.target as HTMLElement).closest('button')) {
      return;
    }

    jump();
  }, [jump]);

  const handlePlayfieldKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.code !== 'Space' && event.code !== 'ArrowUp' && event.code !== 'KeyW') {
      return;
    }

    event.preventDefault();
    jump();
  }, [jump]);

  useEffect(() => {
    resetGame();
    const startDelay = reducedMotion ? 120 : 560;
    const timeout = window.setTimeout(startRun, startDelay);

    return () => window.clearTimeout(timeout);
  }, [character.id, reducedMotion, resetGame, startRun]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.code !== 'ArrowUp' && event.code !== 'KeyW') {
        return;
      }

      event.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  useEffect(() => {
    const tick = (time: number) => {
      const current = snapshotRef.current;

      if (current.status !== 'running') {
        lastFrameTimeRef.current = 0;
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }

      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = time;
      }

      const deltaSeconds = clamp((time - lastFrameTimeRef.current) / 1000, 0, 0.034);
      lastFrameTimeRef.current = time;

      const speed = clamp(BASE_SPEED + current.distance * 0.018, BASE_SPEED, MAX_SPEED);
      const distance = current.distance + speed * deltaSeconds;
      const velocity = current.velocity - GRAVITY * deltaSeconds;
      const y = Math.max(0, current.y + velocity * deltaSeconds);
      const resolvedVelocity = y === 0 && velocity < 0 ? 0 : velocity;
      let obstacles = current.obstacles
        .map((obstacle) => ({ ...obstacle, x: obstacle.x - speed * deltaSeconds }))
        .filter((obstacle) => obstacle.x + obstacle.width > -32);

      const lastObstacle = obstacles[obstacles.length - 1];
      if (!lastObstacle || lastObstacle.x < WORLD_WIDTH - nextGapRef.current) {
        obstacles = [...obstacles, createObstacle(nextObstacleIdRef.current)];
        nextObstacleIdRef.current += 1;
        nextGapRef.current = randomGap(speed);
      }

      const nextSnapshot: RunnerSnapshot = {
        ...current,
        y,
        velocity: resolvedVelocity,
        distance,
        speed,
        score: Math.floor(distance / SCORE_UNIT),
        obstacles,
      };

      if (hasCollision(nextSnapshot)) {
        const gameOverSnapshot = {
          ...nextSnapshot,
          status: 'gameOver' as const,
          velocity: 0,
        };
        setBestScore((currentBest) => Math.max(currentBest, gameOverSnapshot.score));
        commitSnapshot(gameOverSnapshot);
      } else {
        commitSnapshot(nextSnapshot);
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== 0) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [commitSnapshot, setBestScore]);

  const runnerStyle = {
    '--mission-accent': character.accentColor,
  } as CSSProperties;

  return (
    <div className={styles.runner} style={runnerStyle} aria-label="Signal Sprint runner">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Mission active</p>
          <h3 className={styles.title}>Signal Sprint</h3>
        </div>
        <button type="button" className={styles.backButton} onClick={onExit}>
          Back to Portfolio
        </button>
      </header>

      <section className={styles.shell}>
        <div
          className={styles.playfield}
          ref={playfieldRef}
          onPointerDown={handlePlayfieldPointerDown}
          onKeyDown={handlePlayfieldKeyDown}
          tabIndex={0}
          role="application"
          aria-label="Side scrolling jump mission. Press Space, W, Arrow Up, or tap to jump."
        >
          <div className={styles.hud} aria-live="polite">
            <span className={styles.scoreValue}>Score {snapshot.score}</span>
            <span className={styles.bestValue}>Best {Math.max(bestScore, snapshot.score)}</span>
            {snapshot.status !== 'gameOver' && (
              <span className={styles.controlsBox} aria-label="Jump controls">
                W / Space / Up arrow / click is Jump
              </span>
            )}
          </div>

          <div className={styles.skyline} aria-hidden="true" />
          <div className={styles.starTrack} aria-hidden="true" />
          <div className={styles.horizon} aria-hidden="true" />

          {snapshot.obstacles.map((obstacle) => (
            <div
              key={obstacle.id}
              className={`${styles.obstacle} ${styles[obstacle.tone]}`}
              style={{
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`,
                transform: `translate3d(${obstacle.x}px, 0, 0)`,
              }}
              aria-hidden="true"
            />
          ))}

          <div
            className={styles.player}
            style={{ transform: `translate3d(${PLAYER_X}px, ${-snapshot.y}px, 0)` }}
            aria-hidden="true"
          >
            <img src={processedFrame} alt="" draggable={false} />
          </div>

          <div className={styles.ground} aria-hidden="true" />

          {snapshot.status === 'ready' && (
            <div className={styles.message}>
              <p>Get ready</p>
            </div>
          )}

          {snapshot.status === 'gameOver' && (
            <div className={styles.message}>
              <p>Mission failed</p>
              <span>Score {snapshot.score}</span>
              <div className={styles.messageActions}>
                <button type="button" onClick={handleRetry}>
                  Retry
                </button>
                <button type="button" onClick={onExit}>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
