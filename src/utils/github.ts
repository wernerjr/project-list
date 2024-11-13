import { GithubRepository } from '@/types/github';

export const githubQuery = `
  query {
    user(login: "wernerjr") {
      repositories(
        first: 100, 
        privacy: PUBLIC, 
        isArchived: false, 
        orderBy: {field: NAME, direction: ASC}
        ownerAffiliations: [OWNER]
      ) {
        nodes {
          id
          name
          description
          url
          homepageUrl
          updatedAt
          isArchived
          primaryLanguage {
            name
            color
          }
          languages(first: 10) {
            nodes {
              name
              color
            }
          }
          stargazerCount
          forkCount
          topics: repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const fetchGithubProjects = async () => {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: githubQuery }),
  });

  const { data } = await response.json();
  return data?.user?.repositories?.nodes || [];
}; 