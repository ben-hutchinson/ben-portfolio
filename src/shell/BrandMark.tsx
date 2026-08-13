import type { JSX } from 'react';

export interface BrandMarkProps {
  readonly className?: string;
  readonly decorative?: boolean;
}

export function BrandMark({ className, decorative = true }: BrandMarkProps): JSX.Element {
  return (
    <svg
      className={className}
      data-testid="portfolio-os-mark"
      viewBox="0 0 64 64"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
    >
      {decorative ? null : <title>Portfolio OS</title>}
      <rect x="3" y="3" width="58" height="58" rx="5" fill="#132218" />
      <path d="M16 15v34h20c9 0 14-4 14-10 0-5-3-8-8-9 4-2 6-5 6-8 0-5-4-7-12-7H16Zm9 8h10c3 0 4 1 4 3s-1 3-4 3H25v-6Zm0 13h12c3 0 5 1 5 3s-2 3-5 3H25v-6Z" fill="#d9f7c5" />
      <rect x="47" y="47" width="9" height="9" fill="#ff6542" />
    </svg>
  );
}
