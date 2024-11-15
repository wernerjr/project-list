import { GitHubRepo } from '@/types/github';

export async function generateRepoDescription(repo: GitHubRepo): Promise<string> {
  // Se já existe uma descrição, retorna ela
  if (repo.description) {
    return repo.description;
  }

  // Função auxiliar para gerar descrição básica
  const getBasicDescription = () => {
    const parts = [];
    if (repo.language) {
      parts.push(`Repositório em ${repo.language}`);
    }
    if ((repo.topics ?? []).length > 0) {
      parts.push(`focado em ${(repo.topics ?? []).slice(0, 3).join(', ')}`);
    }
    return parts.join(' ') || `Repositório ${repo.name}`;
  };

  // Se não tiver token configurado, retorna descrição básica
  if (!process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN) {
    return getBasicDescription();
  }

  try {
    const prompt = `
      Descreva de forma objetiva este repositório GitHub:
      
      Nome do Repositório: ${repo.name}
      Linguagem Principal: ${repo.language || 'Não especificada'}
      Tópicos: ${repo.topics?.join(', ') || 'Nenhum'}
      
      Responda apenas com uma descrição curta e direta, sem introduções ou explicações adicionais.
      A descrição deve ter no máximo 100 caracteres.

      Ao final traduza essa descrição para o português do Brasil.
    `.trim();

    const response = await fetch(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // GPT-2 retorna um array com um objeto contendo generated_text
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      const generatedText = data[0].generated_text.trim();
      // Remove o prompt original da resposta, se presente
      const cleanText = generatedText.replace(prompt, '').trim();
      return cleanText.slice(0, 100) || getBasicDescription();
    }

    return getBasicDescription();

  } catch (error) {
    console.warn('Erro ao gerar descrição via IA:', error);
    return getBasicDescription();
  }
} 