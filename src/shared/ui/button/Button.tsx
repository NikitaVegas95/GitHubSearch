import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  const className = variant === 'ghost' ? `${styles.button} ${styles.ghost}` : styles.button;

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
