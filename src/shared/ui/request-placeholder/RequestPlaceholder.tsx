import styles from './RequestPlaceholder.module.scss';

interface RequestPlaceholderProps {
  cards?: number;
  linesPerCard?: number;
}

export function RequestPlaceholder({ cards = 3, linesPerCard = 3 }: RequestPlaceholderProps) {
  return (
    <section className={styles.wrapper} aria-live="polite" aria-label="Загрузка">
      {Array.from({ length: cards }).map((_, cardIndex) => (
        <article key={cardIndex} className={styles.card}>
          <div className={`${styles.line} ${styles.title}`} />
          {Array.from({ length: linesPerCard }).map((__, lineIndex) => (
            <div key={lineIndex} className={styles.line} />
          ))}
        </article>
      ))}
    </section>
  );
}
