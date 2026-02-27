import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppRoutes } from '@shared/config/routes';
import { RequestPlaceholder } from '@shared/ui/request-placeholder';
import { AppLayout } from '@widgets/app-layout/ui';

const SearchPage = lazy(async () => {
  const module = await import('@pages/search-page/ui');
  return { default: module.SearchPage };
});

const RepositoryDetailsPage = lazy(async () => {
  const module = await import('@pages/repository-details-page/ui');
  return { default: module.RepositoryDetailsPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('@pages/not-found-page/ui');
  return { default: module.NotFoundPage };
});

export function AppRouter() {
  return (
    <Routes>
      <Route path={AppRoutes.HOME} element={<AppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<RequestPlaceholder cards={3} linesPerCard={3} />}>
              <SearchPage />
            </Suspense>
          }
        />
        <Route
          path={AppRoutes.REPOSITORY_DETAILS}
          element={
            <Suspense fallback={<RequestPlaceholder cards={1} linesPerCard={7} />}>
              <RepositoryDetailsPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<RequestPlaceholder cards={1} linesPerCard={4} />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
