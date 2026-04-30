import { buildPixellabCharacterAssets } from '../utils/assets';
import type { CharacterProfile } from './types';

export const characters: CharacterProfile[] = [
  {
    id: 'ben',
    name: 'Ben',
    role: 'Frontend Engineer',
    rosterSubtitle: 'Developer',
    accentColor: '#62f7e8',
    spriteCleanup: {
      keyColor: [2, 24, 52],
      tolerance: 28,
    },
    panelLabels: {
      about: 'About',
      career: 'Career',
      skills: 'Skills',
      projects: 'Projects',
    },
    sectionCopy: {
      about:
        'Software engineer focused on reliable systems, practical problem-solving, and real-world impact.',
      career:
        'Each role focused on delivering reliable frontend systems, improving developer velocity, and collaborating closely with design and product.',
      skills:
        'Depth in React ecosystem development, TypeScript architecture, and design system execution, supported by practical product thinking.',
      projects:
        'These projects represent shipping discipline: clear scope, intentional design decisions, and maintainable implementation.',
    },
    aboutParagraphs: [
      'I am a software engineer who enjoys solving real problems and building reliable systems that make a genuine impact. Professionally, I have worked in fast-paced, high-traffic environments across brands like Flutter UKI, Paddy Power, Betfair, and Sky Betting & Gaming, where I have built backend systems from scratch, improved critical customer-facing logic, supported production systems on-call, and helped teams ship confidently under pressure. I am now continuing that journey as a Junior Developer at SKAO, where I am applying my backend and problem-solving skills in a scientific, mission-driven environment at the forefront of global astronomy.',
      'I am AI-adoptive and proficient, using modern AI tools to accelerate delivery, automate repetitive work, and explore better engineering workflows without losing sight of code quality or ownership.',
      'What makes me a little different is the route I took to get here. Before software engineering, I studied science to postgraduate level, which means I naturally approach problems with curiosity, evidence, and a healthy obsession with finding root causes. I am also big on continuous improvement - whether that is mentoring junior engineers, working towards AWS certifications, building side projects, or learning new tech just because it looks interesting. In short: I like building things that work, improving things that do not, and working with good people along the way.',
    ],
    skillsHighlight: ['React + TypeScript', 'Design Systems', 'Performance Tuning'],
    assets: buildPixellabCharacterAssets({
      id: 'ben',
      idleAnimationId: 'animating-5d8ac223',
      idleFrameCount: 4,
      runnerFrameCount: 0,
    }),
  },
  {
    id: 'dog',
    name: 'Blue',
    role: 'Reliability Companion',
    rosterSubtitle: 'K9 expert',
    accentColor: '#b48cff',
    spriteCleanup: {
      keyColor: [2, 24, 52],
      tolerance: 24,
    },
    panelLabels: {
      about: 'About',
      career: 'Career',
      skills: 'Skills',
      projects: 'Projects',
    },
    sectionCopy: {
      about:
        'Loyal execution mode. This slot highlights consistency: deliver on commitments, communicate clearly, and keep momentum during crunch periods.',
      career:
        'A reminder that dependable collaboration often matters as much as technical depth in high-trust teams.',
      skills:
        'Strong in quality gates, release confidence, and practical risk management through incremental delivery.',
      projects:
        'Projects in this lane emphasize operational quality, resilient UX states, and maintainable structure over short-term hacks.',
    },
    skillsHighlight: ['QA Mindset', 'Release Stability', 'Team Reliability'],
    assets: buildPixellabCharacterAssets({
      id: 'dog',
      idleAnimationId: 'animation-ee316fb6',
      runnerAnimationId: 'animation-ee316fb6',
      runnerFrameCount: 8,
    }),
  },
  {
    id: 'cat',
    name: 'Toni',
    role: 'Curiosity Engine',
    rosterSubtitle: 'Feline Fixer',
    accentColor: '#f6d469',
    spriteCleanup: {
      keyColor: [2, 24, 52],
      tolerance: 24,
    },
    panelLabels: {
      about: 'About',
      career: 'Career',
      skills: 'Skills',
      projects: 'Projects',
    },
    sectionCopy: {
      about:
        'This slot represents curiosity and refinement: investigate edge cases, ask better questions, and keep polishing where it matters most.',
      career:
        'Growth came from shipping repeatedly, learning from production feedback, and raising standards over time.',
      skills:
        'Comfortable balancing product clarity with technical rigor, especially in UI architecture and user flows.',
      projects:
        'Selected work includes product surfaces where visual quality and implementation detail both needed to be excellent.',
    },
    skillsHighlight: ['UX Polish', 'Interaction Design', 'Code Quality'],
    assets: buildPixellabCharacterAssets({
      id: 'cat',
      idleAnimationId: 'animation-967576f1',
      runnerAnimationId: 'animation-967576f1',
      runnerFrameCount: 8,
    }),
  },
];

export const defaultCharacterId: CharacterProfile['id'] = 'ben';
