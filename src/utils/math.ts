export const mod = (value: number, length: number): number => {
  if (length <= 0) {
    return 0;
  }

  return ((value % length) + length) % length;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
