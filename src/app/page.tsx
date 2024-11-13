import { GitHubProjects } from '@/components/GitHubProjects';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Meus Projetos no GitHub</h1>
      <GitHubProjects />
    </main>
  );
}
