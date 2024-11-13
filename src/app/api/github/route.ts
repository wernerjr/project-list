import { githubQuery } from '@/utils/github';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    console.log('Usando token:', token?.slice(0, 10) + '...');

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: githubQuery }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro na API:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no servidor:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 