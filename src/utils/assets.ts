interface PixellabCharacterAssetOptions {
  id: string;
  direction?: 'south' | 'east' | 'north' | 'west';
  runnerAnimationId?: string;
  runnerFrameCount?: number;
}

interface CommandCharacterAssetOptions {
  id: string;
  runnerFrameCount?: number;
}

const withBase = (path: string): string => {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalized}`;
};

const characterAssetPath = (characterId: string, file: string): string => {
  return withBase(`assets/characters/${characterId}/${file}`);
};

export const commandCharacterAssetPath = (characterId: string, file: string): string => {
  return characterAssetPath(characterId, `command-v2/${file}`);
};

const pixellabAssetPath = (characterId: string, file: string): string => {
  return characterAssetPath(characterId, `pixellab/${file}`);
};

const buildPixellabAnimationFrames = (
  characterId: string,
  animationId: string,
  direction: NonNullable<PixellabCharacterAssetOptions['direction']>,
  frameCount: number,
): string[] => {
  return Array.from({ length: frameCount }, (_, frameIndex) => {
    const frame = frameIndex.toString().padStart(3, '0');
    return pixellabAssetPath(
      characterId,
      `animations/${animationId}/${direction}/frame_${frame}.png`,
    );
  });
};

export const buildPixellabCharacterAssets = ({
  id,
  direction = 'south',
  runnerAnimationId,
  runnerFrameCount = 0,
}: PixellabCharacterAssetOptions) => {
  const front = pixellabAssetPath(id, `rotations/${direction}.png`);
  const runnerStill = pixellabAssetPath(id, 'rotations/east.png');
  const runnerRunFrames = runnerAnimationId
    ? buildPixellabAnimationFrames(id, runnerAnimationId, 'east', runnerFrameCount)
    : [];

  return {
    thumb: front,
    front,
    runnerStill,
    runnerRunFrames,
    runnerFrameMs: 115,
  };
};

export const buildCommandCharacterAssets = ({
  id,
  runnerFrameCount = 8,
}: CommandCharacterAssetOptions) => {
  const front = commandCharacterAssetPath(id, 'rotations/south.png');

  return {
    hero: commandCharacterAssetPath(id, 'hero.webp'),
    thumb: front,
    front,
    runnerStill: commandCharacterAssetPath(id, 'rotations/east.png'),
    runnerRunFrames: Array.from({ length: runnerFrameCount }, (_, frameIndex) => {
      const frame = frameIndex.toString().padStart(3, '0');
      return commandCharacterAssetPath(id, `runner/frame_${frame}.png`);
    }),
    runnerFrameMs: 115,
  };
};

export const projectAssetPath = (file: string): string => withBase(`assets/ui/${file}`);
export const audioAssetPath = (file: string): string => withBase(`assets/audio/${file}`);
export const cvAssetPath = (file: string): string => withBase(`cv/${file}`);
