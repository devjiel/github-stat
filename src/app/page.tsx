import { Suspense } from 'react';
import CommitsList from '../components/CommitsList';
import { GitHubCommit } from '../types/github';

async function getInitialCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
  try {
    console.log(`[Server] Fetching initial commits for ${owner}/${repo}`);
    
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?page=1&per_page=10`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'NextJS-GitHub-Stats'
        },
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      console.error(`[Server] GitHub API error: ${response.status}`);
      return [];
    }

    const commits: GitHubCommit[] = await response.json();
    console.log(`[Server] Fetched ${commits.length} initial commits`);
    
    return commits;
  } catch (error) {
    console.error('[Server] Error fetching initial commits:', error);
    return [];
  }
}

async function CommitsContent() {
  const owner = 'vercel';
  const repo = 'next.js';
  
  const initialCommits = await getInitialCommits(owner, repo);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Commits de {owner}/{repo}
        </h1>
        <p className="text-slate-400">
          Derniers commits du repository
        </p>
      </div>

      {initialCommits.length > 0 ? (
        <CommitsList 
          initialCommits={initialCommits}
          owner={owner}
          repo={repo}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-400">Cannot load commits</p>
        </div>
      )}
    </div>
  );
}

export default function CommitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Suspense fallback={
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-400">Loading commits...</p>
          </div>
        </div>
      }>
        <CommitsContent />
      </Suspense>
    </div>
  );
}
