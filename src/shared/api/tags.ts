export const API_TAGS = {
  repository: 'Repository',
  repositoryList: 'RepositoryList'
} as const;

export const API_TAG_TYPES = [API_TAGS.repository, API_TAGS.repositoryList] as const;

export const getRepositoryListTagId = (query: string, page: number): string =>
  `${query.trim().toLowerCase()}:${String(page)}`;

export const getRepositoryTagId = (id: number): number => id;

export const getRepositoryTagIdByParams = (owner: string, name: string): string => `${owner}/${name}`;
