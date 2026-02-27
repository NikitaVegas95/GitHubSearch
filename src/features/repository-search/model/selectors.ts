import { createSelector } from '@reduxjs/toolkit';

import type { RepositorySearchState } from './types';

import type { Repository } from '@entities/repository/model/types';
import type { SortOrder } from '@shared/types';

const UNKNOWN_LANGUAGE = 'Неизвестно';

interface WithRepositorySearchState {
  repositorySearch: RepositorySearchState;
}

export const selectRepositorySearch = (state: WithRepositorySearchState) => state.repositorySearch;
export const selectQuery = (state: WithRepositorySearchState) => state.repositorySearch.query;
export const selectLastExecutedQuery = (state: WithRepositorySearchState) =>
  state.repositorySearch.lastExecutedQuery;
export const selectSortOrder = (state: WithRepositorySearchState) => state.repositorySearch.sortOrder;
export const selectLanguageFilter = (state: WithRepositorySearchState) => state.repositorySearch.languageFilter;
export const selectHistory = (state: WithRepositorySearchState) => state.repositorySearch.history;
export const selectCurrentPage = (state: WithRepositorySearchState) => state.repositorySearch.currentPage;

export const makeSelectLanguages = () =>
  createSelector(
    [(items: Repository[]) => items],
    (items): string[] => {
      const languages = new Set<string>();

      items.forEach((item) => {
        if (item.language) {
          languages.add(item.language);
        }
      });

      return Array.from(languages).sort((a, b) => a.localeCompare(b));
    }
  );

export const makeSelectVisibleRepositories = () =>
  createSelector(
    [
      (items: Repository[]) => items,
      (_items: Repository[], sortOrder: SortOrder) => sortOrder,
      (_items: Repository[], _sortOrder: SortOrder, languageFilter: string) => languageFilter
    ],
    (items, sortOrder, languageFilter): Repository[] => {
      const filteredItems =
        languageFilter === 'all'
          ? items
          : items.filter((item) => (item.language ?? UNKNOWN_LANGUAGE) === languageFilter);

      return [...filteredItems].sort((a, b) =>
        sortOrder === 'desc'
          ? b.stargazers_count - a.stargazers_count
          : a.stargazers_count - b.stargazers_count
      );
    }
  );
