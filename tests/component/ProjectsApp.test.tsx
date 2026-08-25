import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { projects } from '../../src/data/projects';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

function renderProjects(hash = '#projects') {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
  window.history.replaceState(null, '', hash);
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

function projectsFrame(): HTMLElement {
  const frame = document.querySelector<HTMLElement>('[data-window-id="projects"]');
  if (frame === null) throw new Error('Projects frame was not rendered');
  return frame;
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '#desktop');
});

describe('Projects application', () => {
  it('renders the canonical catalogue with an intentionally dominant featured project', () => {
    renderProjects();
    const frame = projectsFrame();

    expect(within(frame).getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
    expect(within(frame).getByTestId('project-entry-pokeleximon')).toHaveAttribute('data-featured', 'true');
    expect(within(frame).getByTestId('project-entry-safelog')).not.toHaveAttribute('data-featured');
    for (const project of projects) {
      expect(within(frame).getByRole('heading', { name: project.title })).toBeVisible();
      expect(frame).toHaveTextContent(project.blurb);
    }
  });

  it('selects a project by canonical id and supports returning to the catalogue', async () => {
    const user = userEvent.setup();
    renderProjects();

    await user.click(within(projectsFrame()).getByRole('button', { name: 'Open Pokeleximon Daily case study' }));
    expect(window.location.hash).toBe('#projects/pokeleximon');
    expect(within(projectsFrame()).getByRole('heading', { level: 1, name: 'Pokeleximon Daily' })).toBeVisible();

    await user.click(within(projectsFrame()).getByRole('button', { name: 'Back to projects' }));
    expect(window.location.hash).toBe('#projects');
    expect(within(projectsFrame()).getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
  });

  it('renders a direct detail hash with safe verified external actions', () => {
    renderProjects('#projects/safelog');
    const frame = projectsFrame();
    expect(within(frame).getByRole('heading', { level: 1, name: 'Safelog' })).toBeVisible();
    const link = within(frame).getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/ben-hutchinson/safelog');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  });
});
