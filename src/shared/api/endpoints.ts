import { SEARCH_PER_PAGE } from './config';

export const GITHUB_API_ENDPOINTS = {
  searchRepositories: '/search/repositories',
  repositoryByOwnerAndName: (owner: string, name: string) =>
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
} as const;

export const buildSearchRepositoriesEndpoint = (query: string, page: number): string =>
  `${GITHUB_API_ENDPOINTS.searchRepositories}?q=${encodeURIComponent(query)}&per_page=${String(SEARCH_PER_PAGE)}&page=${String(page)}`;
