import type { Middleware } from '@reduxjs/toolkit';

import {
  clearHistory,
  setSearchContext,
  type RepositorySearchState
} from '@features/repository-search/model';
import { SEARCH_HISTORY_STORAGE_KEY } from '@shared/config/appConstants';

const saveSearchHistoryToStorage = (history: string[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore write failures (private mode/quota exceeded).
  }
};

export const searchHistoryMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);

  if (setSearchContext.match(action) || clearHistory.match(action)) {
    const state = storeApi.getState() as { repositorySearch: RepositorySearchState };
    saveSearchHistoryToStorage(state.repositorySearch.history);
  }

  return result;
};
