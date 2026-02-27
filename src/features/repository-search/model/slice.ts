import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RepositorySearchState } from './types';

import { SEARCH_HISTORY_LIMIT, SEARCH_HISTORY_STORAGE_KEY } from '@shared/config/appConstants';
import type { SortOrder } from '@shared/types';

interface SetSearchContextPayload {
  query: string;
  page: number;
}

const initialState: RepositorySearchState = {
  query: '',
  lastExecutedQuery: '',
  sortOrder: 'desc',
  languageFilter: 'all',
  history: loadSearchHistoryFromStorage(),
  currentPage: 1
};

const repositorySearchSlice = createSlice({
  name: 'repositorySearch',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    setLanguageFilter: (state, action: PayloadAction<string>) => {
      state.languageFilter = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
    setSearchContext: (state, action: PayloadAction<SetSearchContextPayload>) => {
      const normalizedQuery = action.payload.query.trim();
      const requestedPage = action.payload.page;

      state.lastExecutedQuery = normalizedQuery;
      state.currentPage = requestedPage;

      if (requestedPage === 1) {
        state.languageFilter = 'all';
      }

      if (normalizedQuery && requestedPage === 1) {
        state.history = [normalizedQuery, ...state.history.filter((item) => item !== normalizedQuery)].slice(
          0,
          SEARCH_HISTORY_LIMIT
        );
      }
    }
  }
});

export const {
  setQuery,
  setSortOrder,
  setLanguageFilter,
  clearHistory,
  setSearchContext
} =
  repositorySearchSlice.actions;

export const repositorySearchReducer = repositorySearchSlice.reducer;

function loadSearchHistoryFromStorage(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed.slice(0, SEARCH_HISTORY_LIMIT);
    }
  } catch {
    // Ignore malformed localStorage data.
  }

  return [];
}
