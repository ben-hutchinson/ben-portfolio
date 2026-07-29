export type SectionId = 'about' | 'career' | 'skills' | 'projects';

export interface CharacterPanelLabels {
  about: string;
  career: string;
  skills: string;
  projects: string;
}

export interface CharacterAssets {
  hero: string;
  thumb: string;
  front: string;
  runnerStill?: string;
  runnerRunFrames?: string[];
  runnerFrameMs?: number;
}

export interface SpriteCleanupConfig {
  keyColor: [number, number, number];
  tolerance: number;
}

export interface CharacterProfile {
  id: 'ben' | 'dog' | 'cat';
  name: string;
  role: string;
  rosterSubtitle: string;
  accentColor: string;
  spriteCleanup: SpriteCleanupConfig;
  panelLabels: CharacterPanelLabels;
  aboutParagraphs?: string[];
  timelineEvents?: TimelineEvent[];
  skillCategories?: SkillCategory[];
  projects?: ProjectEntry[];
  assets: CharacterAssets;
}

export interface CrewMember {
  id: CharacterProfile['id'];
  name: string;
  heroSrc: string;
  assignment: string;
  callSign: string;
}

export interface SectionDefinition {
  id: SectionId;
  label: string;
  ariaLabel: string;
}

export interface TimelineEvent {
  year?: string;
  title: string;
  currentPosition?: string;
  description?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectBriefing {
  context: string;
  constraint: string;
  responsibilities: string[];
  decisions: string[];
  delivery: string;
  outcome: string;
}

export interface ProjectEntry {
  id: string;
  kind: 'personal' | 'work';
  title: string;
  blurb: string;
  image?: string;
  tags: string[];
  links: ProjectLink[];
  featured?: boolean;
  category?: string;
  systemShape?: string[];
  engineeringStory?: string;
  briefing?: ProjectBriefing;
}

export type TopologyGroupId = 'platform' | 'product' | 'tooling';

export interface TopologyNode {
  id: 'skao' | 'flutter' | 'pokeleximon' | 'safelog' | 'observability';
  label: string;
  description: string;
  groups: TopologyGroupId[];
}
