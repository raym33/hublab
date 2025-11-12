import { DATA_INTEGRATION_TEMPLATES } from '@/lib/data-integration'

describe('Data Integration Templates', () => {
  it('should have all required templates', () => {
    expect(DATA_INTEGRATION_TEMPLATES).toHaveProperty('rest-api')
    expect(DATA_INTEGRATION_TEMPLATES).toHaveProperty('supabase')
    expect(DATA_INTEGRATION_TEMPLATES).toHaveProperty('graphql')
    expect(DATA_INTEGRATION_TEMPLATES).toHaveProperty('state-management')
    expect(DATA_INTEGRATION_TEMPLATES).toHaveProperty('form-handling')
    expect(DATA_INTEGRATION_TEMPLATES).toHaveProperty('authentication')
  })

  it('all templates should be non-empty strings', () => {
    Object.values(DATA_INTEGRATION_TEMPLATES).forEach(template => {
      expect(typeof template).toBe('string')
      expect(template.length).toBeGreaterThan(0)
    })
  })

  describe('REST API Template', () => {
    it('should include useSWR hook', () => {
      const template = DATA_INTEGRATION_TEMPLATES['rest-api']
      expect(template).toContain('useSWR')
      expect(template).toContain('import')
    })

    it('should include fetcher function', () => {
      const template = DATA_INTEGRATION_TEMPLATES['rest-api']
      expect(template).toContain('fetcher')
      expect(template).toContain('fetch')
    })
  })

  describe('Supabase Template', () => {
    it('should include Supabase client', () => {
      const template = DATA_INTEGRATION_TEMPLATES['supabase']
      expect(template).toContain('supabase')
      expect(template).toContain('createClient')
    })

    it('should include realtime subscription', () => {
      const template = DATA_INTEGRATION_TEMPLATES['supabase']
      expect(template).toContain('useRealtimeData')
      expect(template).toContain('subscribe')
    })
  })

  describe('GraphQL Template', () => {
    it('should include Apollo Client', () => {
      const template = DATA_INTEGRATION_TEMPLATES['graphql']
      expect(template).toContain('ApolloClient')
      expect(template).toContain('useQuery')
    })

    it('should include gql tag', () => {
      const template = DATA_INTEGRATION_TEMPLATES['graphql']
      expect(template).toContain('gql')
    })
  })

  describe('State Management Template', () => {
    it('should include Zustand', () => {
      const template = DATA_INTEGRATION_TEMPLATES['state-management']
      expect(template).toContain('create')
      expect(template).toContain('zustand')
    })

    it('should include CRUD operations', () => {
      const template = DATA_INTEGRATION_TEMPLATES['state-management']
      expect(template).toContain('addItem')
      expect(template).toContain('removeItem')
      expect(template).toContain('updateItem')
    })
  })

  describe('Form Handling Template', () => {
    it('should include React Hook Form', () => {
      const template = DATA_INTEGRATION_TEMPLATES['form-handling']
      expect(template).toContain('useForm')
      expect(template).toContain('react-hook-form')
    })

    it('should include Zod validation', () => {
      const template = DATA_INTEGRATION_TEMPLATES['form-handling']
      expect(template).toContain('z.object')
      expect(template).toContain('zodResolver')
    })
  })

  describe('Authentication Template', () => {
    it('should include NextAuth', () => {
      const template = DATA_INTEGRATION_TEMPLATES['authentication']
      expect(template).toContain('NextAuth')
      expect(template).toContain('useSession')
    })

    it('should include auth methods', () => {
      const template = DATA_INTEGRATION_TEMPLATES['authentication']
      expect(template).toContain('signIn')
      expect(template).toContain('signOut')
    })
  })
})
