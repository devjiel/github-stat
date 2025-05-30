import { Octokit } from '@octokit/rest';

export async function getUserCommitCount(username, accessToken) {
  try {

    const octokit = new Octokit({
      auth: accessToken,
    });


    const { data: repos } = await octokit.repos.listForUser({
      username,
      per_page: 100,
      sort: 'updated',
    });

    let totalCommits = 0;

    for (const repo of repos) {
      try {
        const { data: commits } = await octokit.repos.listCommits({
          owner: repo.owner.login,
          repo: repo.name,
          author: username,
          per_page: 100,
        });
        totalCommits += commits.length;
      } catch (error) {
        console.warn(`Cannot access commits of ${repo.name}`);
      }
    }

    return {
      username,
      totalCommits,
      publicRepos: repos.length,
    };
  } catch (error) {
    throw new Error(`Error while fetching stats: ${error.message}`);
  }
}