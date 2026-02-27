import {
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError
} from '@reduxjs/toolkit/query';

import { GITHUB_API_BASE_URL } from './config';
import { apiErrorHandlers } from './errorHandlers';
import { getApiErrorKey, getGithubApiErrorMessage } from './errorMapper';

import { emitApiNotification } from '@shared/lib/apiNotifications';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: GITHUB_API_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/vnd.github+json');
    return headers;
  }
});

const getRequestMethod = (args: string | FetchArgs): string =>
  typeof args === 'string' ? 'GET' : (args.method?.toUpperCase() ?? 'GET');

const shouldRetryRequest = (error: FetchBaseQueryError, args: string | FetchArgs): boolean => {
  const method = getRequestMethod(args);

  if (method !== 'GET' && method !== 'HEAD') {
    return false;
  }

  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return true;
  }

  if (typeof error.status === 'number') {
    return error.status >= 500;
  }

  return false;
};

export const baseQueryWithInterceptor: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && shouldRetryRequest(result.error, args)) {
      result = await rawBaseQuery(args, api, extraOptions);
    }

    if (result.error) {
      await handleApiError({
        api,
        args,
        error: result.error
      });
    }

    return result;
  };

const handleApiError = async ({
  api,
  args,
  error
}: {
  api: BaseQueryApi;
  args: string | FetchArgs;
  error: FetchBaseQueryError;
}): Promise<void> => {
  const errorKey = getApiErrorKey(error);
  emitApiNotification(getGithubApiErrorMessage(error));
  const handler = apiErrorHandlers[errorKey] ?? apiErrorHandlers.UNKNOWN;

  if (!handler) {
    return;
  }

  await handler({ api, args, error });
};
