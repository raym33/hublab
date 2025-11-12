// ============================================
// GRAPHQL INTEGRATION HELPERS
// ============================================

export type GraphQLRequestConfig = {
  endpoint: string
  query: string
  variables?: Record<string, any>
  headers?: Record<string, string>
  operationName?: string
}

export type GraphQLResponse<T = any> = {
  data: T | null
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: string[]
  }>
}

// ============================================
// GRAPHQL CLIENT
// ============================================

export class GraphQLClient {
  private endpoint: string
  private defaultHeaders: Record<string, string>

  constructor(endpoint: string, headers: Record<string, string> = {}) {
    this.endpoint = endpoint
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    }
  }

  async request<T = any>(
    query: string,
    variables?: Record<string, any>,
    operationName?: string,
    headers?: Record<string, string>
  ): Promise<GraphQLResponse<T>> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: JSON.stringify({
          query,
          variables,
          operationName,
        }),
      })

      const result: GraphQLResponse<T> = await response.json()
      return result
    } catch (error: any) {
      return {
        data: null,
        errors: [{ message: error.message || 'GraphQL request failed' }],
      }
    }
  }

  async query<T = any>(
    query: string,
    variables?: Record<string, any>,
    operationName?: string
  ): Promise<GraphQLResponse<T>> {
    return this.request<T>(query, variables, operationName)
  }

  async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>,
    operationName?: string
  ): Promise<GraphQLResponse<T>> {
    return this.request<T>(mutation, variables, operationName)
  }

  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value
  }

  removeHeader(key: string) {
    delete this.defaultHeaders[key]
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

export async function graphqlRequest<T = any>(
  config: GraphQLRequestConfig
): Promise<GraphQLResponse<T>> {
  const { endpoint, query, variables, headers, operationName } = config
  const client = new GraphQLClient(endpoint, headers)
  return client.request<T>(query, variables, operationName)
}

export async function graphqlQuery<T = any>(
  endpoint: string,
  query: string,
  variables?: Record<string, any>,
  headers?: Record<string, string>
): Promise<GraphQLResponse<T>> {
  const client = new GraphQLClient(endpoint, headers)
  return client.query<T>(query, variables)
}

export async function graphqlMutate<T = any>(
  endpoint: string,
  mutation: string,
  variables?: Record<string, any>,
  headers?: Record<string, string>
): Promise<GraphQLResponse<T>> {
  const client = new GraphQLClient(endpoint, headers)
  return client.mutate<T>(mutation, variables)
}

// ============================================
// QUERY BUILDER HELPERS
// ============================================

export class QueryBuilder {
  private queryType: 'query' | 'mutation' | 'subscription'
  private operationName?: string
  private fields: string[] = []
  private variableDefinitions: string[] = []
  private variableValues: Record<string, any> = {}

  constructor(type: 'query' | 'mutation' | 'subscription' = 'query', name?: string) {
    this.queryType = type
    this.operationName = name
  }

  addField(field: string) {
    this.fields.push(field)
    return this
  }

  addVariable(name: string, type: string, value: any) {
    this.variableDefinitions.push(`$${name}: ${type}`)
    this.variableValues[name] = value
    return this
  }

  build(): { query: string; variables: Record<string, any> } {
    const varDefs = this.variableDefinitions.length > 0
      ? `(${this.variableDefinitions.join(', ')})`
      : ''

    const operationNameStr = this.operationName ? ` ${this.operationName}` : ''

    const query = `
      ${this.queryType}${operationNameStr}${varDefs} {
        ${this.fields.join('\n        ')}
      }
    `.trim()

    return {
      query,
      variables: this.variableValues,
    }
  }
}

// ============================================
// APOLLO CLIENT INTEGRATION
// ============================================

export function createApolloFetcher(endpoint: string, headers?: Record<string, string>) {
  const client = new GraphQLClient(endpoint, headers)

  return async ({ query, variables, operationName }: {
    query: string
    variables?: Record<string, any>
    operationName?: string
  }): Promise<any> => {
    const response = await client.request(query, variables, operationName)
    if (response.errors) {
      throw new Error(response.errors[0].message)
    }
    return response.data
  }
}

// ============================================
// URQL INTEGRATION
// ============================================

export function createUrqlExchange(endpoint: string, headers?: Record<string, string>) {
  const client = new GraphQLClient(endpoint, headers)

  return {
    client,
    fetch: async (query: string, variables?: Record<string, any>) => {
      const response = await client.request(query, variables)
      return response
    },
  }
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Simple Query
const { data, errors } = await graphqlQuery(
  'https://api.example.com/graphql',
  `
    query GetUsers {
      users {
        id
        name
        email
      }
    }
  `
)

if (errors) {
  console.error('GraphQL Errors:', errors)
} else {
  console.log('Users:', data.users)
}

// Example 2: Query with Variables
const { data, errors } = await graphqlQuery(
  'https://api.example.com/graphql',
  `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        posts {
          id
          title
        }
      }
    }
  `,
  { id: '123' },
  { 'Authorization': 'Bearer YOUR_TOKEN' }
)

// Example 3: Mutation
const { data, errors } = await graphqlMutate(
  'https://api.example.com/graphql',
  `
    mutation CreatePost($title: String!, $content: String!) {
      createPost(title: $title, content: $content) {
        id
        title
        content
        createdAt
      }
    }
  `,
  {
    title: 'New Post',
    content: 'Hello World'
  },
  { 'Authorization': 'Bearer YOUR_TOKEN' }
)

// Example 4: Using GraphQL Client
const client = new GraphQLClient('https://api.example.com/graphql', {
  'Authorization': 'Bearer YOUR_TOKEN'
})

// Multiple requests with same client
const usersResponse = await client.query(`
  query { users { id name } }
`)

const postsResponse = await client.query(`
  query { posts { id title } }
`)

const createPostResponse = await client.mutate(`
  mutation CreatePost($title: String!) {
    createPost(title: $title) { id title }
  }
`, { title: 'Test Post' })

// Example 5: Using Query Builder
const builder = new QueryBuilder('query', 'GetUserPosts')
  .addVariable('userId', 'ID!', '123')
  .addVariable('limit', 'Int', 10)
  .addField(`
    user(id: $userId) {
      id
      name
      posts(limit: $limit) {
        id
        title
        createdAt
      }
    }
  `)

const { query, variables } = builder.build()
const response = await graphqlQuery(
  'https://api.example.com/graphql',
  query,
  variables
)

// Example 6: With React and SWR
import useSWR from 'swr'

const endpoint = 'https://api.example.com/graphql'
const query = `
  query GetPosts {
    posts {
      id
      title
      author { name }
    }
  }
`

function Posts() {
  const fetcher = async () => {
    const { data, errors } = await graphqlQuery(endpoint, query)
    if (errors) throw new Error(errors[0].message)
    return data.posts
  }

  const { data, error } = useSWR('posts', fetcher)

  if (error) return <div>Error loading posts</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      {data.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
        </div>
      ))}
    </div>
  )
}
*/
