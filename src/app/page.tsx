import { Suspense } from 'react';
import GitHubStats from '../components/GitHubStats';

export default function CommitsPage() {
  const username = 'devjiel';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Suspense fallback={
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-slate-400">Loading commits...</p>
          </div>
        </div>
      }>
        <GitHubStats username={username} />
      </Suspense>
    </div>
  );
}
