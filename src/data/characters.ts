import { buildCommandCharacterAssets } from '../utils/assets';
import type { CharacterProfile, CrewMember } from './types';

export const characters: CharacterProfile[] = [
  {
    id: 'ben',
    name: 'Ben',
    role: 'Developer',
    rosterSubtitle: 'Software Engineer',
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
    aboutParagraphs: [
      'I am a software engineer who enjoys solving real problems and building reliable systems that make a genuine impact. Professionally, I have worked in fast-paced, high-traffic environments across brands like Flutter UKI, Paddy Power, Betfair, and Sky Betting & Gaming, where I have built backend systems from scratch, improved critical customer-facing logic, supported production systems on-call, and helped teams ship confidently under pressure. I am now continuing that journey as a Junior Developer at SKAO, where I am applying my backend and problem-solving skills in a scientific, mission-driven environment at the forefront of global astronomy.',
      'I am AI-adoptive and proficient, using modern AI tools to accelerate delivery, automate repetitive work, and explore better engineering workflows without losing sight of code quality or ownership.',
      'What makes me a little different is the route I took to get here. Before software engineering, I studied science to postgraduate level, which means I naturally approach problems with curiosity, evidence, and a healthy obsession with finding root causes. I am also big on continuous improvement - whether that is mentoring junior engineers, working towards AWS certifications, building side projects, or learning new tech just because it looks interesting. In short: I like building things that work, improving things that do not, and working with good people along the way.',
    ],
    assets: buildCommandCharacterAssets({
      id: 'ben',
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
    aboutParagraphs: [
      'The loyal canine companion to Ben, this pooch is always by his side ready to contribute. Needs 18 hours of sleep per day. Will distract from important work by requesting scratches or belly rubs. Key value comes in sniffing out code smells and eating up bugs.',
    ],
    timelineEvents: [
      { title: 'Puppy' },
      { title: 'Adult' },
      { title: 'Retired' },
    ],
    skillCategories: [
      {
        id: 'dog-skills',
        label: '',
        items: ['Eating', 'Sniffing', 'Fetching', 'Chomping', 'Cardboard destruction', 'Sleeping', 'Napping'],
      },
    ],
    projects: [
      {
        id: 'bone-modelling',
        kind: 'personal',
        title: 'Bone Modelling',
        blurb: 'Advanced chew-object analysis focused on shape, texture, and long-term gnawability.',
        tags: ['Research', 'Chewing'],
        links: [],
      },
      {
        id: 'hole-digging',
        kind: 'personal',
        title: 'Hole Digging',
        blurb: 'Groundbreaking excavation work with strong emphasis on garden disruption and rapid dirt displacement.',
        tags: ['Excavation', 'Field Work'],
        links: [],
      },
    ],
    assets: buildCommandCharacterAssets({
      id: 'dog',
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
    aboutParagraphs: [
      'The aloof third member of the team. Always grumpy, always hungry. This groovy cat will either be the catalyst for success or sole reason for disaster. Is prone to typos from standing on keyboard.',
    ],
    timelineEvents: [
      { title: 'Kitten' },
      { title: 'Adult' },
    ],
    skillCategories: [
      {
        id: 'cat-skills',
        label: '',
        items: ['Eating', 'Snoozing', 'Climbing', 'Making Biscuits', 'Bug Hunting', 'Stretching', 'Chasing', 'Hiding'],
      },
    ],
    projects: [
      {
        id: 'carpet-shredding',
        kind: 'personal',
        title: 'Carpet Shredding',
        blurb: 'Precision textile stress testing delivered through sudden sprinting, claw calibration, and repeat damage analysis.',
        tags: ['Quality Control', 'Destruction'],
        links: [],
      },
    ],
    assets: buildCommandCharacterAssets({
      id: 'cat',
    }),
  },
];

export const defaultCharacterId: CharacterProfile['id'] = 'ben';

const crewDetails: Record<
  CharacterProfile['id'],
  Pick<CrewMember, 'assignment' | 'callSign'>
> = {
  ben: {
    assignment: 'Systems architect / mission owner',
    callSign: 'Ben',
  },
  dog: {
    assignment: 'Reliability officer',
    callSign: 'Blue',
  },
  cat: {
    assignment: 'Chaos engineering',
    callSign: 'Toni',
  },
};

export const buildCrewMembers = (characterProfiles: CharacterProfile[]): CrewMember[] =>
  characterProfiles.map((character) => ({
    id: character.id,
    name: character.name,
    heroSrc: character.assets.hero,
    ...crewDetails[character.id],
  }));
