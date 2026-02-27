import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import type { Repository } from '../model/types';

import styles from './RepositoryCard.module.scss';

import { getRepositoryDetailsRoute } from '@shared/config/routes';

interface RepositoryCardProps {
  repository: Repository;
}

const DESCRIPTION_MAX_LENGTH = 180;

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const detailsRoute = getRepositoryDetailsRoute(repository.owner.login, repository.name);
  const description = repository.description ?? 'Описание отсутствует.';
  const isDescriptionLong = description.length > DESCRIPTION_MAX_LENGTH;
  const displayDescription = useMemo(() => {
    if (!isDescriptionLong || isDescriptionExpanded) {
      return description;
    }

    return `${description.slice(0, DESCRIPTION_MAX_LENGTH).trimEnd()}...`;
  }, [description, isDescriptionExpanded, isDescriptionLong]);

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>
        <Link to={detailsRoute}>
          {repository.full_name}
        </Link>
      </h3>
      <p className={styles.description}>{displayDescription}</p>
      {isDescriptionLong && (
        <button
          className={styles.toggleDescription}
          type="button"
          onClick={() => {
            setIsDescriptionExpanded((prev) => !prev);
          }}
        >
          {isDescriptionExpanded ? 'Свернуть' : 'Показать полностью'}
        </button>
      )}
      <div className={styles.meta}>
        <span>Звезды: {repository.stargazers_count.toLocaleString()}</span>
        <span>Язык: {repository.language ?? 'Неизвестно'}</span>
        <span>Обновлен: {new Date(repository.updated_at).toLocaleDateString()}</span>
      </div>
      <a className={styles.externalLink} href={repository.html_url} target="_blank" rel="noreferrer">
        GitHub
      </a>
    </article>
  );
}
