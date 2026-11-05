import { act, fireEvent, render, within } from '@testing-library/react';
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
    expect(within(frame).getByTestId('project-entry-trivialise')).toHaveAttribute('data-featured', 'true');
    expect(within(frame).getByTestId('project-entry-safelog')).not.toHaveAttribute('data-featured');
    expect(frame).toHaveTextContent(/Personal systems\s*\/\s*0?5/);
    expect(within(frame).getAllByTestId(/^project-entry-/).map((entry) => entry.dataset.testid)).toEqual([
      'project-entry-trivialise', 'project-entry-pokeleximon', 'project-entry-safelog', 'project-entry-taskmon', 'project-entry-annot8',
    ]);
    for (const project of projects) {
      expect(within(frame).getByRole('heading', { name: project.title })).toBeVisible();
      expect(frame).toHaveTextContent(project.blurb);
      const entry = within(frame).getByTestId(`project-entry-${project.id}`);
      expect(entry).toHaveTextContent(project.category);
      if (project.id !== 'trivialise') expect(entry).not.toHaveAttribute('data-featured');
      const fullSize = within(entry).getByRole('link', { name: `View ${project.title} screenshot full size` });
      expect(fullSize).toHaveAttribute('href', `${import.meta.env.BASE_URL}${project.image}`);
      expect(fullSize).toHaveAttribute('target', '_blank');
      expect(fullSize).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(fullSize).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
      expect(within(fullSize).getByRole('img', { name: `${project.title} project interface` })).toBeVisible();
      expect(fullSize).toHaveTextContent(/^$/);
      expect(within(entry).queryByText(/View full-size screenshot/)).not.toBeInTheDocument();
    }
  });

  it.each([
    { id: 'trivialise', title: 'TRIVIALISE!', repositoryUrl: undefined },
    { id: 'pokeleximon', title: 'Pokeleximon Daily', repositoryUrl: 'https://github.com/ben-hutchinson/pokeleximon' },
    { id: 'safelog', title: 'Safelog', repositoryUrl: 'https://github.com/ben-hutchinson/safelog' },
    { id: 'taskmon', title: 'Taskmon', repositoryUrl: 'https://github.com/ben-hutchinson/taskmon' },
  ])('shows a safe GitHub action for $title without inventing a repository URL', ({ id, title, repositoryUrl }) => {
    renderProjects();
    const entry = within(projectsFrame()).getByTestId(`project-entry-${id}`);
    const github = within(entry).getByRole(repositoryUrl ? 'link' : 'button', { name: /GitHub/i });
    expect(github).toBeVisible();
    expect(github).toHaveTextContent(/^$/);
    const icon = github.querySelector('svg');
    expect(icon).toBeVisible();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('focusable', 'false');
    expect(icon?.querySelector('path')).toHaveAttribute('d', expect.stringMatching(/\S/));
    expect(github).toHaveAccessibleName(expect.stringContaining(title));
    if (repositoryUrl) {
      expect(github).toHaveAttribute('href', repositoryUrl);
      expect(github).toHaveAttribute('target', '_blank');
      expect(github).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(github).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    } else {
      expect(github).toBeDisabled();
      expect(github).not.toHaveAttribute('href');
      expect(github).toHaveAttribute('title', 'GitHub repository not available yet');
    }
  });

  it.each([
    ['trivialise', 'TRIVIALISE!'], ['taskmon', 'Taskmon'],
  ])('opens %s by button and direct hash and returns to the catalogue', async (id, title) => {
    const user = userEvent.setup();
    const view = renderProjects();
    await user.click(within(projectsFrame()).getByRole('button', { name: `Open ${title} case study` }));
    expect(window.location.hash).toBe(`#projects/${id}`);
    expect(within(projectsFrame()).getByRole('heading', { level: 1, name: title })).toBeVisible();
    await user.click(within(projectsFrame()).getByRole('button', { name: 'Back to projects' }));
    expect(window.location.hash).toBe('#projects');
    view.unmount();

    renderProjects(`#projects/${id}`);
    expect(within(projectsFrame()).getByRole('heading', { level: 1, name: title })).toBeVisible();
    if (id === 'taskmon') {
      const live = within(projectsFrame()).getByRole('link', { name: 'Live app' });
      expect(live).toHaveAttribute('href', 'https://taskmon.pages.dev');
      expect(live).toHaveAttribute('target', '_blank');
      expect(live).toHaveAttribute('rel', 'noreferrer noopener');
    } else {
      expect(within(projectsFrame()).queryByRole('link')).not.toBeInTheDocument();
    }
  });

  it('resets the Projects content scroll when opening a detail from the catalogue', async () => {
    const user = userEvent.setup();
    renderProjects();
    const content = within(projectsFrame()).getByRole('region', { name: 'Projects content' });
    content.scrollTop = 900;
    await user.click(within(projectsFrame()).getByRole('button', { name: 'Open Safelog case study' }));
    expect(window.location.hash).toBe('#projects/safelog');
    expect(content.scrollTop).toBe(0);
  });

  it('recovers the next project image after a direct switch from a failed image', () => {
    renderProjects('#projects/safelog');
    fireEvent.error(within(projectsFrame()).getByRole('img', { name: 'Safelog project interface' }));
    expect(within(projectsFrame()).getByRole('img', { name: 'Safelog project preview unavailable' })).toBeVisible();

    act(() => {
      window.location.hash = '#projects/pokeleximon';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(within(projectsFrame()).getByRole('heading', { level: 1, name: 'Pokeleximon Daily' })).toBeVisible();
    expect(within(projectsFrame()).getByRole('img', { name: 'Pokeleximon Daily project interface' })).toBeVisible();
    expect(within(projectsFrame()).queryByRole('img', { name: /preview unavailable/ })).not.toBeInTheDocument();
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
