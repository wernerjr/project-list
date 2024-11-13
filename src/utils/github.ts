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