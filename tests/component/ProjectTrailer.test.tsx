import { fireEvent, render, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PortfolioProvider } from '../../src/app/PortfolioContext';
import { projects } from '../../src/data/projects';
import { PortfolioShell } from '../../src/shell/PortfolioShell';

const trivialise = projects[2];

function renderProject(hash = '#projects/trivialise') {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
  window.history.replaceState(null, '', hash);
  return render(<PortfolioProvider><PortfolioShell /></PortfolioProvider>);
}

function detailFrame(): HTMLElement {
  const frame = document.querySelector<HTMLElement>('[data-window-id="projects"]');
  expect(frame, 'Projects should render for the supported detail route').not.toBeNull();
  return frame!;
}

function trailerVideo(): HTMLVideoElement {
  const video = detailFrame().querySelector('video');
  expect(video, 'TRIVIALISE! detail should render its native trailer').not.toBeNull();
  return video!;
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState(null, '', '#desktop');
});

describe('ProjectTrailer at its project detail boundary', () => {
  it('provides a named paused native player with deliberate inline playback controls', () => {
    renderProject();
    const video = trailerVideo();

    expect(video).toHaveAccessibleName(/trivialise.*trailer/i);
    expect(video.controls).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.preload).toBe('none');
    expect(video.paused).toBe(true);
    expect(video.autoplay).toBe(false);
    expect(video.loop).toBe(false);
    expect(video).not.toHaveAttribute('autoplay');
    expect(video).not.toHaveAttribute('loop');
  });

  it('uses base-safe local video, poster and named English captions with the canonical transcript', () => {
    renderProject();
    const video = trailerVideo();
    const source = video.getAttribute('src') ?? video.querySelector('source')?.getAttribute('src');

    expect(source).toBe(`${import.meta.env.BASE_URL}${trivialise.trailer.src}`);
    expect(video).toHaveAttribute('poster', `${import.meta.env.BASE_URL}${trivialise.trailer.poster}`);
    const track = video.querySelector('track');
    expect(track).toHaveAttribute('kind', 'captions');
    expect(track).toHaveAttribute('srclang', 'en');
    expect(track).toHaveAttribute('label', 'English');
    expect(track).toHaveAttribute('src', `${import.meta.env.BASE_URL}${trivialise.trailer.captions}`);
    expect(within(detailFrame()).getByText(trivialise.trailer.description, { exact: true })).toBeVisible();
  });

  it('places the real gameplay screenshot before the trailer in the detail', () => {
    renderProject();
    const video = trailerVideo();
    const screenshot = within(detailFrame()).getByRole('img', { name: 'TRIVIALISE! project interface' });

    expect(screenshot).toHaveAttribute('src', `${import.meta.env.BASE_URL}${trivialise.image}`);
    expect(screenshot.compareDocumentPosition(video) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
  });

  it('keeps screenshot, description, transcript and navigation usable when the native video fails', () => {
    renderProject();
    fireEvent.error(trailerVideo());
    const frame = detailFrame();

    expect(frame).toHaveTextContent(/(trailer|video).*(unavailable|could not|failed)/i);
    expect(within(frame).getByRole('img', { name: 'TRIVIALISE! project interface' })).toBeVisible();
    expect(within(frame).getByText(trivialise.blurb, { exact: true })).toBeVisible();
    expect(within(frame).getByText(trivialise.trailer.description, { exact: true })).toBeVisible();
    expect(within(frame).getByRole('button', { name: 'Back to projects' })).toBeEnabled();
  });

  it.each(['pokeleximon', 'safelog', 'taskmon'])('does not render a trailer for %s', (id) => {
    renderProject(`#projects/${id}`);
    expect(detailFrame().querySelector('video')).toBeNull();
  });

  it('keeps trailer players out of the Projects catalogue', () => {
    renderProject('#projects');
    expect(within(detailFrame()).getByRole('heading', { level: 1, name: 'Engineering projects' })).toBeVisible();
    expect(detailFrame().querySelector('video')).toBeNull();
  });
});
