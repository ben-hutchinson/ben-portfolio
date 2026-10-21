import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type JSX, type KeyboardEvent } from 'react';
import { usePortfolio } from '../../app/PortfolioContext';
import type { CommandResult } from './commandRegistry';
import { getCommandSuggestions, type CommandSuggestion } from './commandSuggestions';
import { parseCommand } from './parseCommand';
import styles from './MicroTerminal.module.css';

type VisibleCommandResult = Exclude<CommandResult, { readonly kind: 'clear' }>;

const listId = 'portfolio-command-suggestions';
const hintId = 'portfolio-command-hint';
const optionId = (command: string) => `portfolio-command-option-${command.replace(/\s/g, '-')}`;

export function MicroTerminal(): JSX.Element {
  const { state, dispatch, commandFocusRequestId } = usePortfolio();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<VisibleCommandResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [popupHeight, setPopupHeight] = useState(320);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const terminalRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const composingRef = useRef(false);
  const handledCommandFocusRequestId = useRef(0);
  const cvUrl = `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`;
  const suggestions = getCommandSuggestions(input);
  const activeSuggestion = activeIndex === null ? undefined : suggestions[activeIndex];

  useEffect(() => {
    if (state.route.kind === 'desktop') return;
    setInput('');
    setIsOpen(false);
    setActiveIndex(null);
    composingRef.current = false;
  }, [state.route.kind]);

  useLayoutEffect(() => {
    if (!isOpen || state.route.kind !== 'desktop') return;
    const updateBounds = () => {
      const form = formRef.current;
      const terminal = terminalRef.current;
      if (form === null || terminal === null) return;
      const bounds = form.getBoundingClientRect();
      const normalFlow = window.getComputedStyle(terminal).position !== 'absolute';
      const desktopTop = terminal.parentElement?.getBoundingClientRect().top ?? 0;
      const top = Math.max(desktopTop, window.visualViewport?.offsetTop ?? 0);
      const scale = form.offsetWidth > 0 ? bounds.width / form.offsetWidth : 1;
      const available = normalFlow
        ? (window.visualViewport?.height ?? window.innerHeight) - (inputRef.current?.getBoundingClientRect().height ?? 0) - 16
        : bounds.top - top - 8;
      setPopupHeight(Math.max(0, available / scale));
      if (normalFlow) inputRef.current?.scrollIntoView?.({ block: 'nearest' });
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds, true);
    window.visualViewport?.addEventListener('resize', updateBounds);
    window.visualViewport?.addEventListener('scroll', updateBounds);
    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds, true);
      window.visualViewport?.removeEventListener('resize', updateBounds);
      window.visualViewport?.removeEventListener('scroll', updateBounds);
    };
  }, [isOpen, state.route.kind]);

  useLayoutEffect(() => {
    const list = listRef.current;
    const option = activeSuggestion === undefined ? null : document.getElementById(optionId(activeSuggestion.command));
    if (list === null || option === null) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [activeSuggestion]);

  useEffect(() => {
    if (state.route.kind !== 'desktop' || handledCommandFocusRequestId.current === commandFocusRequestId) return;
    inputRef.current?.focus();
    handledCommandFocusRequestId.current = commandFocusRequestId;
  }, [commandFocusRequestId, state.route.kind]);

  if (state.route.kind !== 'desktop') return <></>;

  const dismissSuggestions = () => {
    setIsOpen(false);
    setActiveIndex(null);
  };

  const acceptSuggestion = (suggestion: CommandSuggestion) => {
    inputRef.current?.focus();
    setInput(suggestion.command);
    dismissSuggestions();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || composingRef.current) {
      if (event.key === 'Enter') event.preventDefault();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      dismissSuggestions();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      if (suggestions.length === 0) return;
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => current === null
        ? direction === 1 ? 0 : suggestions.length - 1
        : (current + direction + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && isOpen && activeSuggestion !== undefined) {
      event.preventDefault();
      acceptSuggestion(activeSuggestion);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (composingRef.current) return;
    const next = parseCommand(input);
    setInput('');
    dismissSuggestions();
    if (next.kind === 'clear') {
      setResult(null);
      return;
    }
    setResult(next);
    if (next.kind === 'action') dispatch(next.action);
  };

  return (
    <aside
      ref={terminalRef}
      className={styles.terminal}
      data-micro-terminal
      data-testid="micro-terminal"
      aria-label="Portfolio command terminal"
      style={{ zIndex: state.windowOrder.length }}
    >
      <div className={styles.titleBar}>
        <span>portfolio command</span>
        <span className={styles.signalDots} aria-hidden="true">● ● ●</span>
      </div>
      <form ref={formRef} className={styles.form} onSubmit={submit}>
        {isOpen ? (
          <div className={styles.popup} style={{ maxHeight: `min(20rem, ${popupHeight}px)` }}>
            <div ref={listRef} className={styles.options} id={listId} role="listbox" aria-label="Suggested portfolio commands">
              {suggestions.map((suggestion, index) => (
                <div
                  className={styles.option}
                  id={optionId(suggestion.command)}
                  key={suggestion.command}
                  role="option"
                  aria-selected={activeIndex === index}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => acceptSuggestion(suggestion)}
                >
                  <strong>{suggestion.command}</strong>
                  <span>{suggestion.description}</span>
                </div>
              ))}
            </div>
            {suggestions.length === 0 ? <p className={styles.noMatches}>No matching commands. Try help.</p> : null}
            <p className={styles.hint} id={hintId}>↑/↓ choose · Enter completes · Enter again runs · Esc closes</p>
          </div>
        ) : null}
        <label className={styles.visuallyHidden} htmlFor="portfolio-command">Portfolio command</label>
        <span className={styles.prompt} aria-hidden="true">&gt;_</span>
        <input
          ref={inputRef}
          id="portfolio-command"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={isOpen && activeSuggestion !== undefined ? optionId(activeSuggestion.command) : undefined}
          aria-describedby={isOpen ? hintId : undefined}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setActiveIndex(null);
            setIsOpen(true);
          }}
          onFocus={() => { setIsOpen(true); setActiveIndex(null); }}
          onBlur={dismissSuggestions}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => { composingRef.current = true; }}
          onCompositionEnd={() => { composingRef.current = false; }}
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
