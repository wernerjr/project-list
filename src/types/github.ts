export interface GithubRepository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  updatedAt: string;
  isArchived: boolean;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: {
    nodes: {
      name: string;
      color: string;
    }[];
  };
  stargazerCount: number;
  forkCount: number;
  topics: {
    nodes: {
      topic: {
        name: string;
      };
    }[];
  };
}

export interface GitHubRepo {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  stargazerCount: number;
  updatedAt: string;
  topics?: string[];
  primaryLanguage?: {
    name: string;
  };
  url: string;
} 