import { useState, type FormEvent, type JSX } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import { commandRegistry, type CommandResult } from './commandRegistry';
import { parseCommand } from './parseCommand';
import styles from './CommandApp.module.css';

interface HistoryEntry {
  readonly id: number;
  readonly input: string;
  readonly result: Exclude<CommandResult, { readonly kind: 'clear' }>;
}

export function CommandApp(): JSX.Element {
  const { state, dispatch } = usePortfolio();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<readonly HistoryEntry[]>([]);
  const [sequence, setSequence] = useState(0);
  const cvUrl = `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`;

  const run = (rawInput: string) => {
    const result = parseCommand(rawInput);
    setInput('');
    if (result.kind === 'clear') {
      setHistory([]);
      return;
    }
    const nextSequence = sequence + 1;
    setSequence(nextSequence);
    setHistory((current) => [...current, { id: nextSequence, input: rawInput, result }].slice(-30));
    if (result.kind === 'action') dispatch(result.action);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(input);
  };

  return (
    <section className={styles.command} aria-labelledby="command-heading">
      <div className={styles.header}>
        <p>Optional shortcut</p>
        <h3 id="command-heading">Command palette</h3>
        <p>Type a known destination, or use the visible controls anywhere in Ben OS.</p>
      </div>
      {state.focusedAppId === 'command' ? (
        <div className={styles.suggestions} aria-label="Command suggestions">
          {commandRegistry.map((command) => (
            <button type="button" onClick={() => run(command.name)} key={command.name}>{command.name}</button>
          ))}
        </div>
      ) : null}
      <div className={styles.history} role="log" aria-live="polite" aria-label="Command output">
        {history.map((entry) => (
          <div className={styles.entry} key={entry.id}>
            <p><span aria-hidden="true">›</span> {entry.input}</p>
            <p>{entry.result.output}</p>
            {entry.result.kind === 'download' ? <a href={cvUrl} download="ben-hutchinson-cv.pdf">Download CV</a> : null}
          </div>
        ))}
      </div>
      <form className={styles.form} onSubmit={submit}>
        <label htmlFor="portfolio-command">Portfolio command</label>
        <div>
          <input id="portfolio-command" value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" spellCheck="false" />
          <button type="submit">Run</button>
        </div>
      </form>
    </section>
  );
}
