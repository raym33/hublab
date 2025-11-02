/**
 * Component Composition System
 *
 * Enables advanced patterns like slots, render props, and compound components
 * for more flexible and reusable component structures
 */

export interface ComponentSlot {
  name: string;
  description: string;
  accepts?: string[]; // Component types that can be placed in this slot
  required?: boolean;
  defaultContent?: string;
}

export interface ComposableComponent {
  id: string;
  name: string;
  slots?: ComponentSlot[];
  allowsChildren?: boolean;
  compositionPattern: 'simple' | 'compound' | 'render-props' | 'slots';
}

/**
 * Compound Component Pattern
 * Example: Card.Header, Card.Body, Card.Footer
 */
export const COMPOUND_COMPONENT_TEMPLATE = `
// Compound Component Pattern Example
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={\`px-6 py-4 border-b border-gray-200 \${className}\`}>
      {children}
    </div>
  );
}

function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={\`px-6 py-4 \${className}\`}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={\`px-6 py-4 border-t border-gray-200 bg-gray-50 \${className}\`}>
      {children}
    </div>
  );
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={\`bg-white rounded-lg shadow-md \${className}\`}>
      {children}
    </div>
  );
}

// Attach sub-components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

// Usage:
// <Card>
//   <Card.Header>Title Here</Card.Header>
//   <Card.Body>Content goes here</Card.Body>
//   <Card.Footer>Actions here</Card.Footer>
// </Card>
`;

/**
 * Render Props Pattern
 */
export const RENDER_PROPS_TEMPLATE = `
// Render Props Pattern Example
interface DataLoaderProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataLoader<T>({ url, children }: DataLoaderProps<T>) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <>{children({ data, loading, error, refetch: fetchData })}</>;
}

export default DataLoader;

// Usage:
// <DataLoader url="/api/users">
//   {({ data, loading, error, refetch }) => {
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error.message}</div>;
//     return (
//       <div>
//         <UserList users={data} />
//         <button onClick={refetch}>Refresh</button>
//       </div>
//     );
//   }}
// </DataLoader>
`;

/**
 * Slots Pattern
 */
export const SLOTS_TEMPLATE = `
// Slots Pattern Example
interface LayoutProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

function Layout({ header, sidebar, main, footer }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Slot */}
      {header && (
        <header className="bg-white shadow-sm border-b">
          {header}
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Sidebar Slot */}
        {sidebar && (
          <aside className="w-64 bg-gray-50 border-r">
            {sidebar}
          </aside>
        )}

        {/* Main Slot */}
        <main className="flex-1 p-8">
          {main}
        </main>
      </div>

      {/* Footer Slot */}
      {footer && (
        <footer className="bg-gray-50 border-t">
          {footer}
        </footer>
      )}
    </div>
  );
}

export default Layout;

// Usage:
// <Layout
//   header={<Navbar />}
//   sidebar={<Sidebar />}
//   main={<Dashboard />}
//   footer={<Footer />}
// />
`;

/**
 * Higher-Order Component (HOC) Pattern
 */
export const HOC_TEMPLATE = `
// Higher-Order Component Pattern Example
interface WithLoadingProps {
  loading?: boolean;
}

function withLoading<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> {
  return function WithLoadingComponent({ loading, ...props }: WithLoadingProps & P) {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return <Component {...(props as P)} />;
  };
}

// Usage:
// const UserListWithLoading = withLoading(UserList);
// <UserListWithLoading loading={isLoading} users={users} />
`;

/**
 * Custom Hooks Pattern
 */
export const CUSTOM_HOOKS_TEMPLATE = `
// Custom Hooks Pattern Example

// 1. useToggle Hook
function useToggle(initialState = false): [boolean, () => void] {
  const [state, setState] = React.useState(initialState);
  const toggle = React.useCallback(() => setState(prev => !prev), []);
  return [state, toggle];
}

// 2. useLocalStorage Hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 3. useDebounce Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 4. useAsync Hook
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useAsync<T>(asyncFunction: () => Promise<T>, dependencies: any[] = []) {
  const [state, setState] = React.useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    let isMounted = true;
    setState({ data: null, loading: true, error: null });

    asyncFunction()
      .then(data => {
        if (isMounted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(error => {
        if (isMounted) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

// Usage Examples:
// const [isOpen, toggleOpen] = useToggle();
// const [user, setUser] = useLocalStorage('user', null);
// const debouncedSearch = useDebounce(searchTerm, 500);
// const { data, loading, error } = useAsync(() => fetchUsers(), []);
`;

/**
 * Context Provider Pattern
 */
export const CONTEXT_PROVIDER_TEMPLATE = `
// Context Provider Pattern Example
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage:
// <ThemeProvider>
//   <App />
// </ThemeProvider>
//
// In components:
// const { theme, toggleTheme } = useTheme();
`;

/**
 * Composable Components Registry
 */
export const COMPOSABLE_PATTERNS = {
  'compound-components': {
    name: 'Compound Components',
    description: 'Components with sub-components (Card.Header, Card.Body)',
    template: COMPOUND_COMPONENT_TEMPLATE,
    useCase: 'When you need flexible, self-contained component groups',
    example: 'Card, Tabs, Accordion',
  },
  'render-props': {
    name: 'Render Props',
    description: 'Components that accept render functions as children',
    template: RENDER_PROPS_TEMPLATE,
    useCase: 'When you need to share logic with customizable rendering',
    example: 'DataLoader, MouseTracker, WindowSize',
  },
  'slots': {
    name: 'Slots Pattern',
    description: 'Components with named slots for flexible layouts',
    template: SLOTS_TEMPLATE,
    useCase: 'When you need predefined areas with optional content',
    example: 'Layout, Modal, Dialog',
  },
  'hoc': {
    name: 'Higher-Order Components',
    description: 'Functions that wrap components with additional functionality',
    template: HOC_TEMPLATE,
    useCase: 'When you need to enhance multiple components with same behavior',
    example: 'withLoading, withAuth, withAnalytics',
  },
  'custom-hooks': {
    name: 'Custom Hooks',
    description: 'Reusable stateful logic extracted into hooks',
    template: CUSTOM_HOOKS_TEMPLATE,
    useCase: 'When you need to reuse stateful logic across components',
    example: 'useToggle, useLocalStorage, useDebounce, useAsync',
  },
  'context-provider': {
    name: 'Context Provider',
    description: 'Global state management with React Context',
    template: CONTEXT_PROVIDER_TEMPLATE,
    useCase: 'When you need to share state across many components',
    example: 'ThemeProvider, AuthProvider, LanguageProvider',
  },
};

/**
 * Generate integration guide for a composition pattern
 */
export function generateCompositionGuide(patternKey: keyof typeof COMPOSABLE_PATTERNS): string {
  const pattern = COMPOSABLE_PATTERNS[patternKey];

  return `
# ${pattern.name} Guide

## Overview
${pattern.description}

## When to Use
${pattern.useCase}

## Common Examples
${pattern.example}

## Implementation

${pattern.template}

## Best Practices

1. **Keep it Simple** - Don't over-engineer. Use the simplest pattern that solves your problem.
2. **Type Safety** - Use TypeScript for better developer experience.
3. **Documentation** - Document expected props and behavior.
4. **Testing** - Write tests for each composition pattern.

## Integration with HubLab

HubLab components can be enhanced with these patterns:

1. Export your component from HubLab
2. Wrap it with the composition pattern
3. Add your custom logic
4. Use the enhanced component in your app

## Learn More

- [React Patterns](https://reactpatterns.com/)
- [Advanced React Patterns](https://kentcdodds.com/blog/advanced-react-patterns)
  `.trim();
}
