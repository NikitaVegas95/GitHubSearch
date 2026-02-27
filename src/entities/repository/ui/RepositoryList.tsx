import { memo } from 'react';

import type { Repository } from '../model/types';

import { RepositoryCard } from './RepositoryCard';
import styles from './RepositoryList.module.scss';

interface RepositoryListProps {
  items: Repository[];
}

function RepositoryListComponent({ items }: RepositoryListProps) {
  return (
    <section className={styles.list}>
      {items.map((item) => (
        <RepositoryCard key={item.id} repository={item} />
      ))}
    </section>
  );
}

export const RepositoryList = memo(RepositoryListComponent);
