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

    const results = await Promise.all(
      repos.map(async (repo) => {
        try {
          const commitsPromise = octokit.repos.listCommits({
            owner: repo.owner.login,
            repo: repo.name,
            author: username,
            since: getPeriod(period),
            until: new Date().toISOString(),
            per_page: 100,
          });

          const languagesPromise = octokit.repos.listLanguages({
            owner: repo.owner.login,
            repo: repo.name,
          });

          const [{ data: commits }, { data: repoLanguages }] = await Promise.all([commitsPromise, languagesPromise]);

          return { commits, repoLanguages };
        } catch (error) {
          console.warn(`Cannot access commits of ${repo.name}`);
          return { commits: [], repoLanguages: {} };
        }
      })
    );

    let totalCommits = 0;
    let languages = {};

    for (const { commits, repoLanguages } of results) {
      totalCommits += commits.length;
      languages = { ...languages, ...repoLanguages };
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