import type { InputHTMLAttributes } from 'react';

import styles from './TextInput.module.scss';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput(props: TextInputProps) {
  return <input className={styles.input} {...props} />;
}
