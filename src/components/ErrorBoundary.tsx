import { Component, type ErrorInfo, type ReactNode } from 'react';
import { externalLinks } from '../data/externalLinks';
import { profile } from '../data/profile';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

const github = externalLinks.find((link) => link.label === 'GitHub');
const email = externalLinks.find((link) => link.label === 'Email');

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // The recovery screen is intentionally self-contained so static hosting
    // still gives visitors useful exits if the application cannot render.
    void error;
    void errorInfo;
  }

  public render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    const cvUrl = `${import.meta.env.BASE_URL}cv/ben-hutchinson-cv.pdf`;
    return (
      <main className={styles.recovery} aria-labelledby="recovery-title">
        <p className={styles.kicker}>Portfolio recovery</p>
        <h1 id="recovery-title">{profile.name}</h1>
        <p>Something interrupted the portfolio. These direct paths are still available.</p>
        <nav className={styles.actions} aria-label="Portfolio recovery links">
          {email ? <a href={email.href}>Contact</a> : null}
          <a href={cvUrl} download="ben-hutchinson-cv.pdf">Download CV</a>
          {github ? <a href={github.href} target="_blank" rel="noopener noreferrer">GitHub</a> : null}
        </nav>
      </main>
    );
  }
}
