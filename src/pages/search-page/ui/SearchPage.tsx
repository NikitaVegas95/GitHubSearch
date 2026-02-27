import styles from './SearchPage.module.scss';

import { RepositorySearchDashboard } from '@widgets/repository-search-dashboard/ui';


export function SearchPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Поиск репозиториев GitHub</h1>
      <RepositorySearchDashboard />
    </section>
  );
}
