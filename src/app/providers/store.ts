import { configureStore } from '@reduxjs/toolkit';

import { searchHistoryMiddleware } from './searchHistoryMiddleware';

import { repositorySearchReducer } from '@features/repository-search/model';
import { githubApi } from '@shared/api';

export const store = configureStore({
  reducer: {
    repositorySearch: repositorySearchReducer,
    [githubApi.reducerPath]: githubApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware, searchHistoryMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
