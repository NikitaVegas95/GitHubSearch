import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import styles from './RepositoryDetailsWidget.module.scss';

import { RepositoryDetailsCard } from '@entities/repository-details/ui';
import {
  getGithubApiErrorMessage,
  useLazyGetRepositoryDetailsQuery
} from '@shared/api';
import { AppRoutes } from '@shared/config/routes';
import { RequestPlaceholder } from '@shared/ui/request-placeholder';


interface RepositoryDetailsWidgetProps {
  owner: string;
  name: string;
}

export function RepositoryDetailsWidget({ owner, name }: RepositoryDetailsWidgetProps) {
  const [triggerRepositoryDetails, { data, error, isError, isFetching }] =
    useLazyGetRepositoryDetailsQuery();
  const activeDetailsRequestRef = useRef<ReturnType<typeof triggerRepositoryDetails> | null>(null);
  const errorMessage = isError
    ? getGithubApiErrorMessage(error, {
      notFoundMessage: 'Репозиторий не найден.'
    })
    : null;

  useEffect(() => {
    activeDetailsRequestRef.current?.abort();
    const request = triggerRepositoryDetails({ owner, name });
    activeDetailsRequestRef.current = request;

    return () => {
      request.abort();
    };
  }, [owner, name, triggerRepositoryDetails]);

  return (
    <section>
      <Link className={styles.backLink} to={AppRoutes.HOME}>
        Назад к поиску
      </Link>

      {isFetching && <RequestPlaceholder cards={1} linesPerCard={7} />}
      {errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
      {data && <RepositoryDetailsCard repository={data} />}
    </section>
  );
}
