import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './CommandButton.module.css';

type Variant = 'primary' | 'secondary' | 'quiet';

interface CommandButtonProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  disabled?: boolean;
}

export const CommandButton = ({
  children,
  className,
  variant = 'secondary',
  href,
  onClick,
  type = 'button',
  ariaLabel,
  disabled,
}: CommandButtonProps) => {
  const classes = cn(styles.button, styles[variant], className);

  if (href) {
    return (
      <a aria-label={ariaLabel} className={classes} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button aria-label={ariaLabel} className={classes} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
};
