export interface GithubStats {
  username: string;
  totalCommits: number;
  languages: Record<string, number>;
  publicRepos: number;
}