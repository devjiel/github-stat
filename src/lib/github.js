import { Octokit } from '@octokit/rest';

export async function getUserCommitCount(accessToken, username, period) {
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
          since: getPeriod(period),
          until: new Date().toISOString(),
          per_page: 100, // TODO: add pagination
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

function getPeriod(period) {
  switch (period) {
    case 'today':
      return new Date().toISOString();
    case 'week':
      return new Date(new Date().setDate(new Date().getDate() - 7)).toISOString();
    case 'month':
      return new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
    case 'year':
      return new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
    default:
      return new Date().toISOString();
  }
}