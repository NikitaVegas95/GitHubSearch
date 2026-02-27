import type { SearchStatus } from '../model/types';

import styles from './SearchStatus.module.scss';

interface SearchStatusProps {
  error: string | null;
  status: SearchStatus;
  hasItems: boolean;
}

export function SearchStatusMessage({ error, status, hasItems }: SearchStatusProps) {
  if (error) {
    return <p className={`${styles.status} ${styles.error}`}>{error}</p>;
  }

  if (status === 'succeeded' && !hasItems) {
    return <p className={styles.status}>Репозитории не найдены.</p>;
  }

  return null;
}
