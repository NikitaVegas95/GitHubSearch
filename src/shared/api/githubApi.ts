import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithInterceptor } from './baseQuery';
import { buildSearchRepositoriesEndpoint, GITHUB_API_ENDPOINTS } from './endpoints';
import {
  API_TAGS,
  API_TAG_TYPES,
  getRepositoryListTagId,
  getRepositoryTagId,
  getRepositoryTagIdByParams
} from './tags';

interface ApiRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  owner: {
    login: string;
  };
}

interface ApiRepositoryDetails extends ApiRepository {
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
}

interface GithubSearchResponse {
  total_count: number;
  items: ApiRepository[];
}

export interface SearchRepositoriesParams {
  query: string;
  page: number;
}

export interface SearchRepositoriesResponse {
  items: ApiRepository[];
  totalCount: number;
}

export interface RepositoryDetailsParams {
  owner: string;
  name: string;
}

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: baseQueryWithInterceptor,
  tagTypes: API_TAG_TYPES,
  endpoints: (builder) => ({
    searchRepositories: builder.query<SearchRepositoriesResponse, SearchRepositoriesParams>({
      query: ({ query, page }) => buildSearchRepositoriesEndpoint(query, page),
      transformResponse: (response: GithubSearchResponse) => ({
        items: response.items,
        totalCount: response.total_count
      }),
      providesTags: (result, _, { query, page }) => [
        { type: API_TAGS.repositoryList, id: getRepositoryListTagId(query, page) } as const,
        ...(result?.items.map((repository) => ({
          type: API_TAGS.repository,
          id: getRepositoryTagId(repository.id)
        } as const)) ?? [])
      ]
    }),
    getRepositoryDetails: builder.query<ApiRepositoryDetails, RepositoryDetailsParams>({
      query: ({ owner, name }) => GITHUB_API_ENDPOINTS.repositoryByOwnerAndName(owner, name),
      providesTags: (result, _, { owner, name }) => [
        {
          type: API_TAGS.repository,
          id: result?.id ?? getRepositoryTagIdByParams(owner, name)
        } as const
      ]
    })
  })
});

export const {
  useSearchRepositoriesQuery,
  useLazySearchRepositoriesQuery,
  useLazyGetRepositoryDetailsQuery
} = githubApi;
