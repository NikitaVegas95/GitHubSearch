const FALLBACK_GITHUB_API_BASE_URL = 'https://api.github.com';

const rawGithubApiBaseUrl = import.meta.env.VITE_GITHUB_API_BASE_URL?.trim();

const parseGithubApiBaseUrl = (): string => {
  if (!rawGithubApiBaseUrl) {
    return FALLBACK_GITHUB_API_BASE_URL;
  }

  try {
    const parsedUrl = new URL(rawGithubApiBaseUrl);
    return parsedUrl.toString().replace(/\/$/, '');
  } catch {
    console.warn(
      `[api] Invalid VITE_GITHUB_API_BASE_URL: "${rawGithubApiBaseUrl}". Using fallback "${FALLBACK_GITHUB_API_BASE_URL}".`
    );
    return FALLBACK_GITHUB_API_BASE_URL;
  }
};

export const GITHUB_API_BASE_URL = parseGithubApiBaseUrl();

export const SEARCH_PER_PAGE = 30;
