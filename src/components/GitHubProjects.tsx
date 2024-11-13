'use client';

import { useEffect, useState } from 'react';
import { githubQuery } from '@/utils/github';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
}

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

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch('/api/github');
        const responseData = await response.json();
        
        console.log('Resposta completa:', responseData); // Debug

        const { data } = responseData;
        
        if (!data) {
          console.error('Erro na resposta:', responseData);
          setError(`Erro na resposta: ${JSON.stringify(responseData.errors)}`);
          return;
        }

        if (data?.user?.repositories?.nodes) {
          const mappedRepos = data.user.repositories.nodes.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.url,
            stargazers_count: repo.stargazerCount,
            language: repo.primaryLanguage?.name
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {repos.map((repo) => {
        const details = projectDetails[repo.name];
        
        return (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{repo.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {details?.description || repo.description || 'Sem descrição'}
            </p>
            
            {details?.technologies && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {details.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
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
                  <span className="text-sm text-gray-600">{repo.stargazers_count}</span>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
} 