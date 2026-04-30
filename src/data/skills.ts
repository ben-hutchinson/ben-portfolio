import type { SkillCategory } from './types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    items: ['Java', 'Python', 'JavaScript'],
  },
  {
    id: 'backend',
    label: 'Backend and APIs',
    items: ['Spring Boot', 'APIs', 'Docker'],
  },
  {
    id: 'databases',
    label: 'Databases',
    items: ['MongoDB', 'MySQL', 'PostgreSQL'],
  },
  {
    id: 'ai',
    label: 'AI',
    items: ['Agentic Assisted Coding', 'AI Automation'],
  },
  {
    id: 'delivery',
    label: 'Delivery and Quality',
    items: ['TDD', 'CI/CD', 'Agile', 'SAFe'],
  },
  {
    id: 'tooling',
    label: 'Tooling and Observability',
    items: ['Postman', 'Kibana', 'Grafana'],
  },
];
