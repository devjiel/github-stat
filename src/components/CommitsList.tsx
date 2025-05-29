'use client';

import { useState, useEffect } from 'react';
import { GitHubCommit, CommitsResponse } from '../types/github';

interface CommitsListProps {
  initialCommits: GitHubCommit[];
  owner: string;
  repo: string;
}

export default function CommitsList({ initialCommits, owner, repo }: CommitsListProps) {
  const [commits, setCommits] = useState<GitHubCommit[]>(initialCommits);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreCommits = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`[Client] Loading page ${page + 1}`);
      
      const response = await fetch(
        `/api/commits?owner=${owner}&repo=${repo}&page=${page + 1}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de chargement');
      }

      const data: CommitsResponse = await response.json();
      
      if (data.commits.length > 0) {
        setCommits(prev => [...prev, ...data.commits]);
        setPage(prev => prev + 1);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('[Client] Error loading commits:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {commits.map((commit) => (
        <div 
          key={commit.sha} 
          className="bg-slate-800 rounded-lg p-4 border border-slate-700"
        >
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            {commit.author && (
              <img 
                src={commit.author.avatar_url} 
                alt={commit.author.login}
                className="w-10 h-10 rounded-full"
              />
            )}
            
            {/* Contenu du commit */}
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">
                {commit.commit.message}
              </h3>
              
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>
                  Par {commit.commit.author.name}
                </span>
                <span>
                  {new Date(commit.commit.author.date).toLocaleDateString('fr-FR')}
                </span>
                <a 
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Voir sur GitHub
                </a>
              </div>
              
              <div className="mt-2 text-xs text-slate-500 font-mono">
                {commit.sha.substring(0, 7)}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bouton charger plus */}
      <div className="text-center">
        <button
          onClick={loadMoreCommits}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 
                     text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Chargement...' : 'Charger plus de commits'}
        </button>
      </div>

      {/* Gestion d'erreur */}
      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-300">Erreur: {error}</p>
        </div>
      )}
    </div>
  );
}