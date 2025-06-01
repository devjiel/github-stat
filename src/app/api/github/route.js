import { getUserStats } from '@/lib/github';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const period = searchParams.get('period');

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  if (!username) {
    return NextResponse.json(
      { error: 'Username requis' },
      { status: 400 }
    );
  }

  if (!period) {
    return NextResponse.json(
      { error: 'Period required' },
      { status: 400 }
    );
  }

  try {
    const stats = await getUserStats(session.accessToken, username, period);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}