import { Octokit } from '@octokit/rest';

export async function getUserStats(accessToken, username, period) {
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
    let languages = {};

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

        const { data: repoLanguages } = await octokit.repos.listLanguages({
          owner: repo.owner.login,
          repo: repo.name,
          since: getPeriod(period),
          until: new Date().toISOString(),
          per_page: 100, // TODO: add pagination
        });

        totalCommits += commits.length;
        languages = { ...languages, ...repoLanguages };
      } catch (error) {
        console.warn(`Cannot access commits of ${repo.name}`);
      }
    }

    let sortedLanguages = Object.fromEntries(Object.entries(languages).sort((a, b) => b[1] - a[1]));
    let totalBytes = Object.values(sortedLanguages).reduce((acc, curr) => acc + curr, 0);
    let languagesPercentage = Object.fromEntries(Object.entries(sortedLanguages).map(([language, bytes]) => [language, ((bytes / totalBytes) * 100).toFixed(2)]));

    return {
      username,
      totalCommits,
      languages: languagesPercentage,
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