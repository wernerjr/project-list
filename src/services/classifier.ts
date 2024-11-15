import { GitHubRepo } from '@/types/github';

export function classifyProject(repo: GitHubRepo): string {
  if (!repo?.language) return 'Outros';

  const language = repo.language.toLowerCase();

  // Frontend
  if (['javascript', 'typescript', 'html', 'css', 'vue', 'react', 'svelte', 'angular'].includes(language)) {
    return 'Frontend';
  }

  // Mobile
  if (['kotlin', 'swift', 'dart', 'flutter', 'react native'].includes(language)) {
    return 'Mobile';
  }

  // Backend
  if (['python', 'java', 'c#', 'go', 'ruby', 'php', 'rust', 'node.js'].includes(language)) {
    return 'Backend';
  }

  // Dados
  if (['r', 'julia', 'scala', 'matlab'].includes(language)) {
    return 'Dados';
  }

  // Jogos
  if (['c++', 'lua', 'gdscript'].includes(language)) {
    return 'Jogos';
  }

  return 'Outros';
} 