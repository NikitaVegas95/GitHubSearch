import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type ApiErrorKey =
  | `${number}`
  | 'FETCH_ERROR'
  | 'PARSING_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CUSTOM_ERROR'
  | 'UNKNOWN';

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error;

export const getApiErrorKey = (error: unknown): ApiErrorKey => {
  if (!isFetchBaseQueryError(error)) {
    return 'UNKNOWN';
  }

  if (typeof error.status === 'number') {
    return String(error.status) as `${number}`;
  }

  return error.status;
};

export const getGithubApiErrorMessage = (
  error: unknown,
  options: { notFoundMessage?: string } = {}
): string => {
  const errorKey = getApiErrorKey(error);
  if (errorKey === 'FETCH_ERROR' || errorKey === 'TIMEOUT_ERROR') {
    return 'Сетевая ошибка при запросе к GitHub API.';
  }

  if (errorKey === '404' && options.notFoundMessage) {
    return options.notFoundMessage;
  }

  if (errorKey === '403') {
    return 'Превышен лимит запросов GitHub API. Попробуйте позже.';
  }

  if (isFetchBaseQueryError(error) && typeof error.status === 'number') {
    if (error.status === 404 && options.notFoundMessage) {
      return options.notFoundMessage;
    }
    return `Запрос завершился с ошибкой: ${String(error.status)}.`;
  }

  return 'Непредвиденная ошибка.';
};
