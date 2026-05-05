export type SectionId = 'about' | 'career' | 'skills' | 'projects';

export interface CharacterPanelLabels {
  about: string;
  career: string;
  skills: string;
  projects: string;
}

export interface CharacterAssets {
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

export interface ProjectEntry {
  id: string;
  kind: 'personal' | 'work';
  title: string;
  blurb: string;
  image?: string;
  tags: string[];
  links: ProjectLink[];
}
