import { useEffect, useState } from 'react';
import type { SpriteCleanupConfig } from '../data/types';

const cache = new Map<string, string>();

const defaultConfig: SpriteCleanupConfig = {
  keyColor: [2, 24, 52],
  tolerance: 72,
};

const isBackgroundPixel = (
  r: number,
  g: number,
  b: number,
  a: number,
  config: SpriteCleanupConfig,
): boolean => {
  if (a === 0) {
    return false;
  }

  const [keyR, keyG, keyB] = config.keyColor;

  const distance =
    Math.abs(r - keyR) +
    Math.abs(g - keyG) +
    Math.abs(b - keyB);

  const navyLike = b > g && g >= r && r < 58 && g < 90 && b < 130;
  return navyLike && distance <= config.tolerance;
};

const cacheKeyFor = (source: string, config: SpriteCleanupConfig): string => {
  return `${source}::${config.keyColor.join(',')}::${config.tolerance}`;
};

export const useChromaKeySprite = (
  source: string,
  configInput?: SpriteCleanupConfig,
): string => {
  const config = configInput ?? defaultConfig;
  const [processedSource, setProcessedSource] = useState(source);

  useEffect(() => {
    if (!source) {
      setProcessedSource(source);
      return;
    }

    const cacheKey = cacheKeyFor(source, config);
    const cached = cache.get(cacheKey);
    if (cached) {
      setProcessedSource(cached);
      return;
    }

    let isCancelled = false;
    const image = new Image();
    image.decoding = 'async';

    image.onload = () => {
      if (isCancelled) {
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        setProcessedSource(source);
        return;
      }

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      for (let index = 0; index < data.length; index += 4) {
        if (
          isBackgroundPixel(data[index], data[index + 1], data[index + 2], data[index + 3], config)
        ) {
          data[index + 3] = 0;
        }
      }

      context.putImageData(imageData, 0, 0);
      const cleaned = canvas.toDataURL('image/png');
      cache.set(cacheKey, cleaned);
      setProcessedSource(cleaned);
    };

    image.onerror = () => {
      if (!isCancelled) {
        setProcessedSource(source);
      }
    };

    image.src = source;

    return () => {
      isCancelled = true;
    };
  }, [config, source]);

  return processedSource;
};
