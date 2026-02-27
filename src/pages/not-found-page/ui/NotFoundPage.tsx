import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.scss';

import { AppRoutes } from '@shared/config/routes';


export function NotFoundPage() {
  return (
    <section className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.description}>Проверьте адрес или вернитесь к поиску репозиториев.</p>
      <Link className={styles.link} to={AppRoutes.HOME}>
        На главную
      </Link>
    </section>
  );
}
