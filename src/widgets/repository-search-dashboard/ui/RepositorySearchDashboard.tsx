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
  useSearchRepositoriesQuery
} from '@shared/api';
import {
  MAX_SEARCH_RESULTS,
  SEARCH_SUBMIT_DEBOUNCE_MS
} from '@shared/config/appConstants';
import { RequestPlaceholder } from '@shared/ui/request-placeholder';

export function RepositorySearchDashboard() {
  const dispatch = useAppDispatch();
  const submitDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectLanguages = useMemo(makeSelectLanguages, []);
  const selectVisibleRepositories = useMemo(makeSelectVisibleRepositories, []);
  const query = useAppSelector(selectQuery);
  const lastExecutedQuery = useAppSelector(selectLastExecutedQuery);
  const sortOrder = useAppSelector(selectSortOrder);
  const languageFilter = useAppSelector(selectLanguageFilter);
  const history = useAppSelector(selectHistory);
  const currentPage = useAppSelector(selectCurrentPage);
  const normalizedLastExecutedQuery = lastExecutedQuery.trim();
  const shouldSkipSearch = normalizedLastExecutedQuery.length === 0;
  const { data, error, isError, isFetching } = useSearchRepositoriesQuery(
    {
      query: normalizedLastExecutedQuery,
      page: currentPage
    },
    { skip: shouldSkipSearch }
  );

  const items = useMemo(() => {
    if (shouldSkipSearch || data === undefined) {
      return [];
    }

    return data.items;
  }, [data, shouldSkipSearch]);

  const totalCount = useMemo(() => {
    if (shouldSkipSearch || data === undefined) {
      return 0;
    }

    return data.totalCount;
  }, [data, shouldSkipSearch]);

  const totalPages = Math.ceil(Math.min(totalCount, MAX_SEARCH_RESULTS) / SEARCH_PER_PAGE);
  const searchError = !shouldSkipSearch && isError ? getGithubApiErrorMessage(error) : null;

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
    },
    []
  );

  const languages = selectLanguages(items);
  const visibleItems = selectVisibleRepositories(items, sortOrder, languageFilter);

  const executeSearch = (nextQuery: string, page: number) => {
    const normalizedQuery = nextQuery.trim();

    dispatch(setSearchContext({ query: normalizedQuery, page }));
  };

  const handleSearchSubmit = () => {
    if (isFetching) {
      return;
    }

    if (submitDebounceTimeoutRef.current !== null) {
      clearTimeout(submitDebounceTimeoutRef.current);
    }

    submitDebounceTimeoutRef.current = setTimeout(() => {
      executeSearch(query, 1);
    }, SEARCH_SUBMIT_DEBOUNCE_MS);
  };

  const handleHistorySelect = (value: string) => {
    dispatch(setQuery(value));
    executeSearch(value, 1);
  };

  const handlePreviousPage = () => {
    if (currentPage <= 1) {
      return;
    }
    executeSearch(lastExecutedQuery, currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) {
      return;
    }
    executeSearch(lastExecutedQuery, currentPage + 1);
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
