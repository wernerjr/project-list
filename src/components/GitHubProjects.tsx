'use client';

import { useState, useEffect } from 'react';
import { GitHubRepo } from '@/types/github';
import { classifyProject } from '../services/classifier';
import { RepoModal } from './RepoModal';

interface ProjectInfo {
  description: string;
  technologies: string[];
  features: string[];
  preview?: string; // URL para preview do projeto
}

const projectDetails: Record<string, ProjectInfo> = {
  'api-solid': {
    description: 'API RESTful desenvolvida com princípios SOLID e TypeScript.',
    technologies: ['Node.js', 'TypeScript', 'Prisma', 'JWT', 'Vitest'],
    features: [
      'Autenticação JWT',
      'Testes unitários e E2E',
      'Banco de dados PostgreSQL',
      'Docker'
    ]
  },
  'dt-money': {
    description: 'Aplicação de controle financeiro com React.',
    technologies: ['React', 'TypeScript', 'Styled Components', 'Axios'],
    features: [
      'Cadastro de transações',
      'Cálculos automáticos',
      'Filtros de busca',
      'Responsivo'
    ]
  },
  // Adicione mais projetos conforme necessário
};

export function GitHubProjects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [projectCategories, setProjectCategories] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch('/api/github');
        const responseData = await response.json();
        
        const { data } = responseData;
        
        if (!data) {
          console.error('Erro na resposta:', responseData);
          setError(`Erro na resposta: ${JSON.stringify(responseData.errors)}`);
          return;
        }

        if (data?.user?.repositories?.nodes) {
          console.log('Repos recebidos:', data.user.repositories.nodes);
          const mappedRepos = data.user.repositories.nodes.map((repo: GitHubRepo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description || 'Sem descrição',
            url: repo.url,
            stargazers_count: repo.stargazerCount,
            language: repo.primaryLanguage?.name,
            updatedAt: repo.updatedAt,
          }));
          
          setRepos(mappedRepos);
        } else {
          setError('Formato de resposta inválido');
        }
      } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
        setError(`Erro ao carregar repositórios: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, []);

  useEffect(() => {
    async function categorizeProjects() {
      if (repos && repos.length > 0) {
        const categories = await Promise.all(
          repos.map(async (repo) => {
            const category = await classifyProject(repo);
            return [repo.id, category];
          })
        );
        setProjectCategories(Object.fromEntries(categories));
      }
    }

    categorizeProjects();
  }, [repos]);

  useEffect(() => {
    const categories = Object.values(projectCategories);
    const unique = Array.from(new Set(categories)).filter(Boolean);
    setUniqueCategories(unique);
  }, [projectCategories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!repos.length) {
    return (
      <div className="text-center text-gray-500 p-4">
        Nenhum repositório encontrado.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center mb-8">
        <div className="w-full max-w-3xl bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <span className="text-gray-700 whitespace-nowrap text-sm sm:text-base">
              Filtrar por categoria:
            </span>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base"
              >
                <option value="">Todas ({repos.length})</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category} ({repos.filter(repo => projectCategories[repo.id] === category).length})
                  </option>
                ))}
              </select>

              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                {selectedCategory 
                  ? `Mostrando ${repos.filter(repo => projectCategories[repo.id] === selectedCategory).length} de ${repos.length}`
                  : `Mostrando todos os ${repos.length} projetos`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos
          .filter(repo => !selectedCategory || projectCategories[repo.id] === selectedCategory)
          .map((repo) => {
            const details = projectDetails[repo.name];
            const description = repo.description;
            
            return (
              <div
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{repo.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {details?.description || description}
                </p>
                
                {details?.technologies && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {details.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-help"
                          title={projectCategories[tech]}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {details?.features && (
                  <div className="mb-4 text-sm text-gray-600">
                    <ul className="list-disc list-inside">
                      {details.features.slice(0, 2).map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {repo.language || 'N/A'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600">{repo.stargazerCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {selectedRepo && (
        <RepoModal
          repo={selectedRepo}
          isOpen={true}
          onClose={() => setSelectedRepo(null)}
        />
      )}
    </div>
  );
} 