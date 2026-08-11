import type { ExternalLink } from './models';

export const externalLinks = [
  { label: 'Email', href: 'mailto:benhutchinson0412@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ben-hutchinson0412/' },
  { label: 'GitHub', href: 'https://github.com/ben-hutchinson' },
] as const satisfies readonly ExternalLink[];
