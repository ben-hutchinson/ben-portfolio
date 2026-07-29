import type { Variants } from 'framer-motion';

export const sectionReveal = (reducedMotion: boolean): Variants => ({
  hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' },
  },
});

export const revealViewport = { once: true, amount: 0.18 } as const;
