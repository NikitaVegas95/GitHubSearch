import { Link, Outlet } from 'react-router-dom';

import styles from './AppLayout.module.scss';

import { AppRoutes } from '@shared/config/routes';
import { ApiNotice } from '@shared/ui/api-notice';


export function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link className={styles.brand} to={AppRoutes.HOME}>
            Поиск GitHub
          </Link>
        </div>
      </header>

      <div className={styles.container}>
        <ApiNotice />
        <Outlet />
      </div>
    </div>
  );
}
