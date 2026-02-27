import { useParams } from 'react-router-dom';

import styles from './RepositoryDetailsPage.module.scss';

import { RepositoryDetailsWidget } from '@widgets/repository-details/ui';


export function RepositoryDetailsPage() {
  const { owner, name } = useParams<{ owner: string; name: string }>();

  if (!owner || !name) {
    return (
      <section className={styles.page}>
        <p>Некорректный адрес репозитория.</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <RepositoryDetailsWidget owner={owner} name={name} />
    </section>
  );
}
