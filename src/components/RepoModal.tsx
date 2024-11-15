import { GitHubRepo } from '@/types/github';

interface RepoModalProps {
  repo: GitHubRepo;
  generatedDescription: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RepoModal({ repo, generatedDescription, isOpen, onClose }: RepoModalProps) {
  if (!isOpen || !repo) return null;

  const formatDate = (dateString: string) => {
    console.log('Data recebida:', dateString);
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Data não disponível';
      }
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data não disponível';
    }
  };

  console.log('Repo completo:', repo);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{repo.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Descrição Original:</h3>
            <p className="text-gray-600">{repo.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Detalhes:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="font-medium">Linguagem:</span>
                <span>{repo.language || 'N/A'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium">Stars:</span>
                <span className="flex items-center gap-1">
 
                  {repo.stargazerCount || 0}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-medium">Última atualização:</span>
                <span>{formatDate(repo.updatedAt)}</span>
              </li>
            </ul>
          </div>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ver no GitHub
          </a>
        </div>
      </div>
    </div>
  );
} 