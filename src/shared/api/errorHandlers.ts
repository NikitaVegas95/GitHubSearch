import type { BaseQueryApi, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import type { ApiErrorKey } from './errorMapper';

export interface ApiErrorContext {
  api: BaseQueryApi;
  args: string | FetchArgs;
  error: FetchBaseQueryError;
}

type ApiErrorHandler = (context: ApiErrorContext) => void | Promise<void>;

export const apiErrorHandlers: Partial<Record<ApiErrorKey, ApiErrorHandler>> = {
  '401': ({ error, api }) => {
    console.error('Unauthorized API request', error);
    // Reserved place for auth flow side-effects.
    void api;
  },
  '403': ({ error }) => {
    console.error('Forbidden API request', error);
  },
  '404': ({ error }) => {
    console.error('Requested entity not found', error);
  },
  FETCH_ERROR: ({ error }) => {
    console.error('Network error while calling API', error);
  },
  TIMEOUT_ERROR: ({ error }) => {
    console.error('API request timed out', error);
  },
  UNKNOWN: ({ error }) => {
    console.error('Unhandled API error', error);
  }
};
