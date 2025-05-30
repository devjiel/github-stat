import { getUserCommitCount } from '@/lib/github';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: 'Username requis' },
      { status: 400 }
    );
  }

  try {
    const stats = await getUserCommitCount(username);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}