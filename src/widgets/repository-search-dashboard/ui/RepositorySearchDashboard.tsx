import { useEffect, useMemo, useRef } from 'react';

import styles from './RepositorySearchDashboard.module.scss';

import { useAppDispatch, useAppSelector } from '@app/providers/hooks';
import { RepositoryList } from '@entities/repository/ui';
import { RepositoryFilters } from '@features/repository-filters/ui';
import {
  clearHistory,
  makeSelectLanguages,
  makeSelectVisibleRepositories,
  selectCurrentPage,
  selectHistory,
  selectLanguageFilter,
  selectLastExecutedQuery,
  selectQuery,
  selectSortOrder,
  type SearchStatus,
  setLanguageFilter,
  setQuery,
  setSearchContext,
  setSortOrder
} from '@features/repository-search/model';
import {
  PaginationControls,
  RepositorySearchForm,
  SearchStatusMessage
} from '@features/repository-search/ui';
import { SearchHistory } from '@features/search-history/ui';
import {
  getGithubApiErrorMessage,
  SEARCH_PER_PAGE,
  useLazySearchRepositoriesQuery
} from '@shared/api';
import {
  MAX_SEARCH_RESULTS,
  SEARCH_SUBMIT_DEBOUNCE_MS
} from '@shared/config/appConstants';
import { RequestPlaceholder } from '@shared/ui/request-placeholder';

export function RepositorySearchDashboard() {
  const dispatch = useAppDispatch();
  const [triggerSearchRepositories, { data, error, isError, isFetching, originalArgs }] =
    useLazySearchRepositoriesQuery();
  const latestRequestIdRef = useRef(0);
  const submitDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSearchRequestRef = useRef<ReturnType<typeof triggerSearchRepositories> | null>(null);
  const selectLanguages = useMemo(makeSelectLanguages, []);
  const selectVisibleRepositories = useMemo(makeSelectVisibleRepositories, []);
  const query = useAppSelector(selectQuery);
  const lastExecutedQuery = useAppSelector(selectLastExecutedQuery);
  const sortOrder = useAppSelector(selectSortOrder);
  const languageFilter = useAppSelector(selectLanguageFilter);
  const history = useAppSelector(selectHistory);
  const currentPage = useAppSelector(selectCurrentPage);
  const currentArgs = originalArgs ?? null;

  const isDataForCurrentPage =
    data !== undefined &&
    currentArgs !== null &&
    currentArgs.query.trim() === lastExecutedQuery &&
    currentArgs.page === currentPage;

  const isErrorForCurrentPage =
    isError &&
    currentArgs !== null &&
    currentArgs.query.trim() === lastExecutedQuery &&
    currentArgs.page === currentPage;

  const items = useMemo(() => {
    if (!isDataForCurrentPage) {
      return [];
    }

    return data.items;
  }, [data, isDataForCurrentPage]);

  const totalCount = useMemo(() => {
    if (!isDataForCurrentPage) {
      return 0;
    }

    return data.totalCount;
  }, [data, isDataForCurrentPage]);

  const totalPages = Math.ceil(Math.min(totalCount, MAX_SEARCH_RESULTS) / SEARCH_PER_PAGE);
  const searchError = isErrorForCurrentPage ? getGithubApiErrorMessage(error) : null;

  const status: SearchStatus = isFetching
    ? 'loading'
    : searchError
      ? 'failed'
      : lastExecutedQuery
        ? 'succeeded'
        : 'idle';

  useEffect(
    () => () => {
      if (submitDebounceTimeoutRef.current !== null) {
        clearTimeout(submitDebounceTimeoutRef.current);
      }

      activeSearchRequestRef.current?.abort();
    },
    []
  );

  const languages = selectLanguages(items);
  const visibleItems = selectVisibleRepositories(items, sortOrder, languageFilter);

  const executeSearch = async (nextQuery: string, page: number) => {
    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;
    const normalizedQuery = nextQuery.trim();

    dispatch(setSearchContext({ query: normalizedQuery, page }));

    if (!normalizedQuery) {
      if (requestId !== latestRequestIdRef.current) {
        return;
      }

      activeSearchRequestRef.current?.abort();
      activeSearchRequestRef.current = null;
      return;
    }

    activeSearchRequestRef.current?.abort();
    const request = triggerSearchRepositories({ query: normalizedQuery, page });
    activeSearchRequestRef.current = request;
    const result = await request;

    if (requestId !== latestRequestIdRef.current) {
      return;
    }

    if ('data' in result && result.data !== undefined) {
      return;
    }
  };

  const handleSearchSubmit = () => {
    if (isFetching) {
      return;
    }

    if (submitDebounceTimeoutRef.current !== null) {
      clearTimeout(submitDebounceTimeoutRef.current);
    }

    submitDebounceTimeoutRef.current = setTimeout(() => {
      void executeSearch(query, 1);
    }, SEARCH_SUBMIT_DEBOUNCE_MS);
  };

  const handleHistorySelect = (value: string) => {
    dispatch(setQuery(value));
    void executeSearch(value, 1);
  };

  const handlePreviousPage = () => {
    if (currentPage <= 1) {
      return;
    }
    void executeSearch(lastExecutedQuery, currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) {
      return;
    }
    void executeSearch(lastExecutedQuery, currentPage + 1);
  };

  return (
    <section className={styles.dashboard}>
      <RepositorySearchForm
        query={query}
        isLoading={isFetching}
        onQueryChange={(value) => dispatch(setQuery(value))}
        onSubmit={handleSearchSubmit}
      />

      <RepositoryFilters
        sortOrder={sortOrder}
        languageFilter={languageFilter}
        languages={languages}
        isLanguageDisabled={items.length === 0}
        onSortOrderChange={(value) => dispatch(setSortOrder(value))}
        onLanguageFilterChange={(value) => dispatch(setLanguageFilter(value))}
      />

      <SearchHistory
        items={history}
        onSelect={handleHistorySelect}
        onClear={() => dispatch(clearHistory())}
      />

      <SearchStatusMessage error={searchError} status={status} hasItems={items.length > 0} />

      {isFetching ? (
        <RequestPlaceholder cards={3} linesPerCard={3} />
      ) : (
        <>
          <RepositoryList items={visibleItems} />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            isLoading={isFetching}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </>
      )}
    </section>
  );
}
