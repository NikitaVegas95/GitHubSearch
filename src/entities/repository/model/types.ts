export interface Repository {
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

export type RepositoryDetails = Repository & {
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
};
