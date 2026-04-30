interface CharacterAssetOptions {
  id: string;
  includeIdleFrames?: boolean;
}

interface PixellabCharacterAssetOptions {
  id: string;
  idleAnimationId: string;
  idleFrameCount?: number;
  direction?: 'south' | 'east' | 'north' | 'west';
  runnerAnimationId?: string;
  runnerFrameCount?: number;
}

const withBase = (path: string): string => {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalized}`;
};

const characterAssetPath = (characterId: string, file: string): string => {
  return withBase(`assets/characters/${characterId}/${file}`);
};

export const buildCharacterAssets = ({
  id,
  includeIdleFrames = false,
}: CharacterAssetOptions) => {
  return {
    thumb: characterAssetPath(id, `${id}_thumb.png`),
    portrait: characterAssetPath(id, `${id}_portrait.png`),
    front: characterAssetPath(id, `${id}_front.png`),
    idleFrames: includeIdleFrames
      ? [characterAssetPath(id, `${id}_idle_01.png`), characterAssetPath(id, `${id}_idle_02.png`)]
      : [],
  };
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
  idleAnimationId,
  idleFrameCount = 8,
  direction = 'south',
  runnerAnimationId = idleAnimationId,
  runnerFrameCount = idleFrameCount,
}: PixellabCharacterAssetOptions) => {
  const front = pixellabAssetPath(id, `rotations/${direction}.png`);
  const idleFrames = buildPixellabAnimationFrames(id, idleAnimationId, direction, idleFrameCount);
  const runnerStill = pixellabAssetPath(id, 'rotations/east.png');
  const runnerRunFrames = buildPixellabAnimationFrames(id, runnerAnimationId, 'east', runnerFrameCount);

  return {
    thumb: front,
    portrait: front,
    front,
    idleFrames,
    presentationFrames: idleFrames,
    presentationFrameMs: 170,
    runnerStill,
    runnerRunFrames,
    runnerFrameMs: 115,
  };
};

export const projectAssetPath = (file: string): string => withBase(`assets/ui/${file}`);
export const audioAssetPath = (file: string): string => withBase(`assets/audio/${file}`);
export const cvAssetPath = (file: string): string => withBase(`cv/${file}`);
