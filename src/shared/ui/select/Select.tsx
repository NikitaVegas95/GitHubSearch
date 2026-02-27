import type { SelectHTMLAttributes } from 'react';

import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
};

export function Select({ options, ...props }: SelectProps) {
  return (
    <select className={styles.select} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
