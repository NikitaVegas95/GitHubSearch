import type { SortOrder } from '@shared/types';

export type SearchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface RepositorySearchState {
  query: string;
  lastExecutedQuery: string;
  sortOrder: SortOrder;
  languageFilter: string;
  history: string[];
  currentPage: number;
}
