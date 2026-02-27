import styles from './SearchHistory.module.scss';

import { Button } from '@shared/ui/button';


interface SearchHistoryProps {
  items: string[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

export function SearchHistory({ items, onSelect, onClear }: SearchHistoryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2>История поиска</h2>
        <Button type="button" variant="ghost" onClick={onClear}>
          Очистить
        </Button>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <Button key={item} type="button" variant="ghost" onClick={() => { onSelect(item); }}>
            {item}
          </Button>
        ))}
      </div>
    </section>
  );
}
