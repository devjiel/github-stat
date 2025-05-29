export interface GitHubCommit {
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        email: string;
        date: string;
      };
    };
    author: {
      login: string;
      avatar_url: string;
    } | null;
    html_url: string;
  }
  
  export interface CommitsResponse {
    commits: GitHubCommit[];
    error?: string;
  }