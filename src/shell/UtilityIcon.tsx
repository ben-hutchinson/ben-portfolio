import type { JSX } from 'react';

export type UtilityIconKind = 'github' | 'linkedin' | 'cv';

const paths: Readonly<Record<UtilityIconKind, JSX.Element>> = {
  github: <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.84c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />,
  linkedin: <path d="M5.2 7.8H1.8V22h3.4V7.8ZM3.5 2A2 2 0 1 0 3.5 6a2 2 0 0 0 0-4ZM22 13.9c0-4.3-2.3-6.3-5.4-6.3-2.5 0-3.6 1.4-4.2 2.3V7.8H9V22h3.4v-7c0-1.8.4-3.6 2.7-3.6s2.3 2.1 2.3 3.7V22H22v-8.1Z" />,
  cv: <>
    <path d="M5 2h10l4 4v16H5V2Zm9 1v5h5" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12h8M8 16h5M15 19l2 2 2-2M17 14v7" fill="none" stroke="currentColor" strokeWidth="2" />
  </>,
};

export function UtilityIcon({ kind }: { readonly kind: UtilityIconKind }): JSX.Element {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[kind]}</svg>;
}
