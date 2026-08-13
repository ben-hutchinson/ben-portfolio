import { useState, type FormEvent, type JSX } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import type { CommandResult } from './commandRegistry';
import { parseCommand } from './parseCommand';
import styles from './MicroTerminal.module.css';

type VisibleCommandResult = Exclude<CommandResult, { readonly kind: 'clear' }>;

export function MicroTerminal(): JSX.Element {
  const { state, dispatch } = usePortfolio();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<VisibleCommandResult | null>(null);
  const cvUrl = `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`;

  if (state.route.kind !== 'desktop') return <></>;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = parseCommand(input);
    setInput('');
    if (next.kind === 'clear') {
      setResult(null);
      return;
    }
    setResult(next);
    if (next.kind === 'action') dispatch(next.action);
  };

  return (
    <aside
      className={styles.terminal}
      data-micro-terminal
      data-testid="micro-terminal"
      aria-label="Portfolio command terminal"
      style={{ zIndex: Math.max(0, state.windowOrder.length - 1) }}
    >
      <div className={styles.titleBar}>
        <span>portfolio command</span>
        <span className={styles.signalDots} aria-hidden="true">● ● ●</span>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <label className={styles.visuallyHidden} htmlFor="portfolio-command">Portfolio command</label>
        <span className={styles.prompt} aria-hidden="true">&gt;_</span>
        <input
          id="portfolio-command"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          spellCheck="false"
          placeholder="type a command…"
        />
        <button type="submit" aria-label="Run command">↵</button>
      </form>
      {result === null ? null : (
        <div className={styles.result} role="status" aria-live="polite">
          <span>{result.output}</span>
          {result.kind === 'download'
            ? <a href={cvUrl} download="ben-hutchinson-cv.pdf">Download CV</a>
            : null}
        </div>
      )}
    </aside>
  );
}
