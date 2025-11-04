/**
 * GraphQL Schema for HubLab AI Integration
 * Optimized for efficient component queries by AI assistants
 */

export const typeDefs = `#graphql
  type Query {
    """
    Search for components with advanced filtering
    """
    searchComponents(
      query: String!
      category: ComponentCategory
      tags: [String!]
      complexity: Complexity
      limit: Int = 10
      offset: Int = 0
    ): ComponentSearchResult!

    """
    Get a specific component by ID
    """
    component(id: ID!): Component

    """
    Get multiple components by IDs (batch query)
    """
    components(ids: [ID!]!): [Component!]!

    """
    Browse components by category
    """
    componentsByCategory(
      category: ComponentCategory!
      limit: Int = 20
      offset: Int = 0
    ): ComponentList!

    """
    Get library metadata and statistics
    """
    metadata: LibraryMetadata!
  }

  enum ComponentCategory {
    UI
    ECOMMERCE
    DASHBOARD
    MARKETING
  }

  enum Complexity {
    SIMPLE
    MEDIUM
    COMPLEX
  }

  type ComponentSearchResult {
    results: [ComponentSummary!]!
    total: Int!
    query: String!
    limit: Int!
    offset: Int!
    hasMore: Boolean!
  }

  type ComponentList {
    components: [ComponentSummary!]!
    total: Int!
    category: ComponentCategory!
    limit: Int!
    offset: Int!
    hasMore: Boolean!
  }

  type ComponentSummary {
    id: ID!
    name: String!
    category: ComponentCategory!
    description: String!
    tags: [String!]!
    complexity: Complexity!
    previewUrl: String
  }

  type Component {
    id: ID!
    name: String!
    category: ComponentCategory!
    description: String!
    longDescription: String
    code: String!
    props: [ComponentProp!]!
    usage: String!
    example: String!
    dependencies: [Dependency!]!
    tags: [String!]!
    complexity: Complexity!
    accessibility: [String!]!
    previewUrl: String
    relatedComponents: [ComponentSummary!]!
    createdAt: String!
    updatedAt: String!
  }

  type ComponentProp {
    name: String!
    type: String!
    description: String
    required: Boolean!
    default: String
    options: [String!]
  }

  type Dependency {
    name: String!
    version: String
    required: Boolean!
  }

  type LibraryMetadata {
    name: String!
    version: String!
    description: String!
    totalComponents: Int!
    categories: [CategoryInfo!]!
    supportedFrameworks: [String!]!
    supportedAI: [String!]!
    lastUpdated: String!
    apiVersion: String!
    capabilities: Capabilities!
  }

  type CategoryInfo {
    category: ComponentCategory!
    name: String!
    count: Int!
    description: String!
  }

  type Capabilities {
    functionCalling: Boolean!
    semanticSearch: Boolean!
    realtimeSearch: Boolean!
    graphql: Boolean!
    contextWindow: String!
    openAPISpec: String
    pluginManifest: String
  }
`;
