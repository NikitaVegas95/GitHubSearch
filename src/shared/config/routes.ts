export const AppRoutes = {
  HOME: '/',
  REPOSITORY_DETAILS: 'repository/:owner/:name'
} as const;

export const getRepositoryDetailsRoute = (owner: string, name: string) =>
  `/repository/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
