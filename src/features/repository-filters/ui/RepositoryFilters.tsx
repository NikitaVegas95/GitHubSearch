import { useMemo } from 'react';

import styles from './RepositoryFilters.module.scss';

import type { SortOrder } from '@shared/types';
import { Select, type SelectOption } from '@shared/ui/select';


interface RepositoryFiltersProps {
  sortOrder: SortOrder;
  languageFilter: string;
  languages: string[];
  isLanguageDisabled: boolean;
  onSortOrderChange: (value: SortOrder) => void;
  onLanguageFilterChange: (value: string) => void;
}

export function RepositoryFilters({
  sortOrder,
  languageFilter,
  languages,
  isLanguageDisabled,
  onSortOrderChange,
  onLanguageFilterChange
}: RepositoryFiltersProps) {
  const sortOptions = useMemo<SelectOption[]>(
    () => [
      { value: 'desc', label: 'Сначала больше звезд' },
      { value: 'asc', label: 'Сначала меньше звезд' }
    ],
    []
  );

  const languageOptions = useMemo<SelectOption[]>(
    () => [{ value: 'all', label: 'Все языки' }, ...languages.map((language) => ({ value: language, label: language }))],
    [languages]
  );

  return (
    <section className={styles.toolbar}>
      <label className={styles.label}>
        Сортировка по звездам:
        <Select
          value={sortOrder}
          options={sortOptions}
          onChange={(event) => { onSortOrderChange(event.target.value as SortOrder); }}
        />
      </label>

      <label className={styles.label}>
        Фильтр по языку:
        <Select
          value={languageFilter}
          options={languageOptions}
          disabled={isLanguageDisabled}
          onChange={(event) => { onLanguageFilterChange(event.target.value); }}
        />
      </label>
    </section>
  );
}
