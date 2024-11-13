import { fetchGithubProjects } from '@/utils/github';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchGithubProjects();
    return NextResponse.json({ data: { user: { repositories: { nodes: data } } } });
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 