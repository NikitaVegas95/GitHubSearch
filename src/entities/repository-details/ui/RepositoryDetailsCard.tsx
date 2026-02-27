import type { RepositoryDetails } from '../../repository/model/types';

import styles from './RepositoryDetailsCard.module.scss';

interface RepositoryDetailsCardProps {
  repository: RepositoryDetails;
}

export function RepositoryDetailsCard({ repository }: RepositoryDetailsCardProps) {
  return (
    <article className={styles.card}>
      <h1 className={styles.title}>{repository.full_name}</h1>
      <p className={styles.description}>{repository.description ?? 'Описание отсутствует.'}</p>

      <div className={styles.grid}>
        <div>
          <span className={styles.label}>Звезды:</span> {repository.stargazers_count.toLocaleString()}
        </div>
        <div>
          <span className={styles.label}>Наблюдатели:</span> {repository.watchers_count.toLocaleString()}
        </div>
        <div>
          <span className={styles.label}>Форки:</span> {repository.forks_count.toLocaleString()}
        </div>
        <div>
          <span className={styles.label}>Открытые issues:</span> {repository.open_issues_count.toLocaleString()}
        </div>
        <div>
          <span className={styles.label}>Язык:</span> {repository.language ?? 'Неизвестно'}
        </div>
        <div>
          <span className={styles.label}>Основная ветка:</span> {repository.default_branch}
        </div>
        <div>
          <span className={styles.label}>Последнее обновление:</span>{' '}
          {new Date(repository.updated_at).toLocaleDateString()}
        </div>
      </div>

      <a className={styles.link} href={repository.html_url} target="_blank" rel="noreferrer">
        Открыть на GitHub
      </a>
    </article>
  );
}
