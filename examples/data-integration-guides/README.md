# Data Integration Guides

Step-by-step tutorials for connecting HubLab exported components to real data sources.

## Available Guides

1. **[REST API Integration](./rest-api.md)** - Connect to REST APIs using SWR
2. **[Supabase Integration](./supabase.md)** - Real-time data with Supabase
3. **[GraphQL Integration](./graphql.md)** - Query data with Apollo Client
4. **[Firebase Integration](./firebase.md)** - Firestore database integration
5. **[State Management](./state-management.md)** - Global state with Zustand
6. **[Form Handling](./form-handling.md)** - Forms with React Hook Form + Zod
7. **[Authentication](./authentication.md)** - User auth with NextAuth.js

## Quick Start

After exporting your component from HubLab:

1. Choose the data source that matches your backend
2. Follow the guide to install required packages
3. Copy the integration code into your component
4. Configure environment variables
5. Test and deploy

## Common Pattern

All integrations follow this pattern:

```typescript
// 1. Import the hook/client
import { useDataSource } from './integration';

// 2. Use in your component
function MyComponent() {
  const { data, isLoading, error } = useDataSource();
  
  if (isLoading) return <Loading />;
  if (error) return <Error />;
  
  return <YourHubLabComponent data={data} />;
}
```

## Need Help?

- Check [Main Documentation](../../docs/README.md)
- See [Code Examples](../exported-code/)
- Visit [HubLab Discord](https://discord.gg/hublab)
