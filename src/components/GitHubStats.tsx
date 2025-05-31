'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { GithubStats } from '../types/github';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function GitHubStats({ username: initialUsername }: { username: string }) {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (username: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/github?username=${username}&period=${period}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">GitHub Stats</h2>

        <Select defaultValue="week" onValueChange={(value) => setPeriod(value)}>
          <SelectTrigger>
            <SelectValue defaultValue="week" placeholder="Select a period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
        
        {initialUsername && (
          <Button 
            onClick={() => fetchStats(initialUsername)}
            disabled={loading}
            className="mb-4 w-full"
          >
            {loading ? 'Loading...' : `See stats of ${initialUsername}`}
          </Button>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {stats && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold">{stats.username}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalCommits}
                </div>
                <div className="text-sm text-blue-800">Total commits</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.publicRepos}
                </div>
                <div className="text-sm text-green-800">Repos Publics</div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}