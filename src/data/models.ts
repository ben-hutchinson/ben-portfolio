export type AppId = 'about' | 'work' | 'career' | 'projects' | 'contact';

export type CareerStageId = 'graduate' | 'observability' | 'associate' | 'skao';

export type ProjectId = 'pokeleximon' | 'safelog' | 'trivialise' | 'taskmon';

export interface CareerStage {
  id: CareerStageId;
  year: string;
  role: string;
  headline: string;
  evidence: string;
  description: string;
  accent: 'orange' | 'yellow' | 'blue' | 'mint';
}

export interface ExternalLink {
  label: string;
  href: `https://${string}` | `mailto:${string}`;
}

export interface Project {
  id: ProjectId;
  kind: 'personal';
  category: string;
  title: string;
  blurb: string;
  image: string;
  tags: readonly string[];
  links: readonly ExternalLink[];
  trailer?: {
    readonly src: string;
    readonly poster: string;
    readonly captions: string;
    readonly description: string;
  };
}

export interface WorkCaseStudy {
  id: string;
  title: string;
  context: string;
  friction: string;
  ownership: string;
  technicalApproach: string;
  rollout: string;
  outcome: string;
  result: string;
  publicDetail: string;
  links: readonly ExternalLink[];
}
