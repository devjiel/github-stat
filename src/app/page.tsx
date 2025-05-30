'use client';

import { Suspense } from 'react';
import GitHubStats from '../components/GitHubStats';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function CommitsPage() {
  const { data: session, status } = useSession();
  const username = session?.user?.name;

  if (status === 'loading') {
    return (
      <div className="animate-pulse bg-github-200 h-10 w-32 rounded-lg"></div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center">
          <Suspense fallback={
            <div className="container mx-auto px-6 py-8">
              <div className="text-center py-12">
                <p className="text-slate-400">Loading commits...</p>
              </div>
            </div>
          }>
            <GitHubStats username={username || 'devjiel'} />
          </Suspense>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('github')}
      className="flex items-center gap-2 bg-github-900 hover:bg-github-800 text-white px-6 py-3 bg-black rounded-lg transition-colors font-medium"
    >
      Se connecter avec GitHub
    </button>
  );
}
