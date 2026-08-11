import type { CareerStage } from './models';

export const careerStages = [
  {
    id: 'graduate',
    year: '2022 - 2024',
    role: 'Technology Graduate',
    headline: 'Learning to operate production systems',
    evidence: 'Build. Observe. Improve.',
    description:
      'Completed a Level 7 digital solutions apprenticeship while shipping low-latency event-streaming systems using JavaScript, Kotlin, cloud infrastructure, and CI/CD pipelines.',
    accent: 'orange',
  },
  {
    id: 'observability',
    year: '2024',
    role: 'Degree Work: Observability Improvements',
    headline: 'Turning evidence into better reliability',
    evidence: 'Measure. Signal. Respond.',
    description:
      'Delivered a distinction-level dissertation focused on improving observability through better latency metrics and targeted alerting to reduce on-call noise.',
    accent: 'yellow',
  },
  {
    id: 'associate',
    year: '2024 - 2025',
    role: 'Associate Software Engineer',
    headline: 'Owning delivery across changing stacks',
    evidence: 'Adapt. Ship. Support.',
    description:
      'Upskilled across Java and Scala during stack migration, and helped deliver Acca Freeze to address a clear product gap at scale.',
    accent: 'blue',
  },
  {
    id: 'skao',
    year: 'Now',
    role: 'Junior Software Engineer at SKAO',
    headline: 'Building paved roads for engineering teams',
    evidence: '50+ repositories migrated. Four minutes removed from average build time.',
    description:
      'Working with Python and control systems in a high-reliability engineering environment, with a focus on maintainability, operational clarity, and high-quality delivery standards.',
    accent: 'mint',
  },
] as const satisfies readonly CareerStage[];
