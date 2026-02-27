import styles from './RepositorySearchForm.module.scss';

import { Button } from '@shared/ui/button';
import { TextInput } from '@shared/ui/text-input';


interface RepositorySearchFormProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function RepositorySearchForm({
  query,
  isLoading,
  onQueryChange,
  onSubmit
}: RepositorySearchFormProps) {
  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <TextInput
        value={query}
        onChange={(event) => { onQueryChange(event.target.value); }}
        placeholder="Введите название репозитория, тему или ключевое слово"
        aria-label="Поиск репозиториев"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Поиск...' : 'Найти'}
      </Button>
    </form>
  );
}
