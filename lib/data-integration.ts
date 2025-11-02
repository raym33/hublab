/**
 * Data Integration System
 *
 * This module provides templates and utilities for connecting
 * HubLab components to real data sources (APIs, databases, etc.)
 */

export interface DataSource {
  id: string;
  name: string;
  type: 'rest-api' | 'graphql' | 'supabase' | 'firebase' | 'static';
  endpoint?: string;
  config?: Record<string, any>;
}

export interface DataBinding {
  sourceId: string;
  path: string;
  transform?: (data: any) => any;
  refreshInterval?: number;
}

/**
 * REST API Integration Template
 */
export const REST_API_TEMPLATE = `
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useApiData<T>(endpoint: string, options = {}) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    endpoint,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      ...options
    }
  );

  return {
    data,
    error,
    isLoading,
    refetch: mutate
  };
}

// Usage in component:
// const { data, isLoading, error } = useApiData('/api/users');
`;

/**
 * Supabase Integration Template
 */
export const SUPABASE_TEMPLATE = `
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useSupabaseQuery<T>(table: string, options: {
  select?: string;
  filter?: { column: string; value: any };
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
} = {}) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let query = supabase
          .from(table)
          .select(options.select || '*');

        if (options.filter) {
          query = query.eq(options.filter.column, options.filter.value);
        }

        if (options.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true
          });
        }

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error: err } = await query;

        if (err) throw err;
        setData(result as T[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, isLoading, error };
}

// Usage in component:
// const { data: users } = useSupabaseQuery('users', {
//   orderBy: { column: 'created_at', ascending: false },
//   limit: 10
// });
`;

/**
 * GraphQL Integration Template
 */
export const GRAPHQL_TEMPLATE = `
import { useQuery, gql } from '@apollo/client';

export function useGraphQLQuery<T>(query: string, variables = {}) {
  const { data, loading, error, refetch } = useQuery(gql\`\${query}\`, {
    variables,
    fetchPolicy: 'cache-first',
  });

  return {
    data: data as T,
    isLoading: loading,
    error,
    refetch
  };
}

// Usage in component:
// const { data } = useGraphQLQuery(\`
//   query GetUsers {
//     users {
//       id
//       name
//       email
//     }
//   }
// \`);
`;

/**
 * Firebase Integration Template
 */
export const FIREBASE_TEMPLATE = `
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function useFirestoreQuery<T>(
  collectionName: string,
  options: {
    where?: { field: string; operator: any; value: any }[];
    orderBy?: { field: string; direction?: 'asc' | 'desc' };
    limit?: number;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let q = query(collection(db, collectionName));

        if (options.where) {
          options.where.forEach(({ field, operator, value }) => {
            q = query(q, where(field, operator, value));
          });
        }

        if (options.orderBy) {
          q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
        }

        if (options.limit) {
          q = query(q, limit(options.limit));
        }

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];

        setData(results);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [collectionName, JSON.stringify(options)]);

  return { data, isLoading, error };
}

// Usage in component:
// const { data: products } = useFirestoreQuery('products', {
//   where: [{ field: 'category', operator: '==', value: 'electronics' }],
//   orderBy: { field: 'price', direction: 'desc' },
//   limit: 10
// });
`;

/**
 * State Management Template (Zustand)
 */
export const STATE_MANAGEMENT_TEMPLATE = `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  cart: CartItem[];
  theme: 'light' | 'dark';

  // Actions
  setUser: (user: AppState['user']) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleTheme: () => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      cart: [],
      theme: 'light',

      setUser: (user) => set({ user }),

      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => i.id === item.id);
        if (existing) {
          return {
            cart: state.cart.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }),

      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter(i => i.id !== itemId)
      })),

      clearCart: () => set({ cart: [] }),

      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
    }),
    {
      name: 'app-storage',
    }
  )
);

// Usage in component:
// const { user, cart, addToCart } = useAppStore();
`;

/**
 * Form Handling Template (React Hook Form)
 */
export const FORM_HANDLING_TEMPLATE = `
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define validation schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit');

      alert('Form submitted successfully!');
      reset();
    } catch (error) {
      alert('Error submitting form');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('name')}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Message"
          rows={5}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
`;

/**
 * Authentication Template (NextAuth.js)
 */
export const AUTH_TEMPLATE = `
import { signIn, signOut, useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn: () => signIn(),
    signOut: () => signOut(),
  };
}

// Usage in component:
export function ProfileButton() {
  const { user, isAuthenticated, signIn, signOut } = useAuth();

  if (!isAuthenticated) {
    return (
      <button onClick={signIn} className="px-4 py-2 bg-blue-600 text-white rounded">
        Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>Welcome, {user?.name}</span>
      <button onClick={signOut} className="px-4 py-2 bg-gray-200 rounded">
        Sign Out
      </button>
    </div>
  );
}
`;

/**
 * Data Integration Templates Registry
 */
export const DATA_TEMPLATES = {
  'rest-api': {
    name: 'REST API',
    description: 'Fetch data from REST APIs using SWR',
    template: REST_API_TEMPLATE,
    dependencies: ['swr'],
  },
  'supabase': {
    name: 'Supabase',
    description: 'Connect to Supabase database',
    template: SUPABASE_TEMPLATE,
    dependencies: ['@supabase/supabase-js'],
  },
  'graphql': {
    name: 'GraphQL',
    description: 'Query GraphQL APIs with Apollo Client',
    template: GRAPHQL_TEMPLATE,
    dependencies: ['@apollo/client', 'graphql'],
  },
  'firebase': {
    name: 'Firebase',
    description: 'Use Firebase Firestore',
    template: FIREBASE_TEMPLATE,
    dependencies: ['firebase'],
  },
  'state-management': {
    name: 'State Management (Zustand)',
    description: 'Global state management',
    template: STATE_MANAGEMENT_TEMPLATE,
    dependencies: ['zustand'],
  },
  'form-handling': {
    name: 'Form Handling',
    description: 'Form validation with React Hook Form',
    template: FORM_HANDLING_TEMPLATE,
    dependencies: ['react-hook-form', '@hookform/resolvers', 'zod'],
  },
  'auth': {
    name: 'Authentication',
    description: 'User authentication with NextAuth',
    template: AUTH_TEMPLATE,
    dependencies: ['next-auth'],
  },
};

/**
 * Generate integration guide for a specific template
 */
export function generateIntegrationGuide(templateKey: keyof typeof DATA_TEMPLATES): string {
  const template = DATA_TEMPLATES[templateKey];

  return `
# ${template.name} Integration Guide

## Overview
${template.description}

## Installation

\`\`\`bash
npm install ${template.dependencies.join(' ')}
\`\`\`

## Setup

${template.template}

## Next Steps

1. Copy the code above into a new file in your project
2. Install the required dependencies
3. Configure environment variables if needed
4. Import and use in your components

## Learn More

- Check the official documentation for each library
- See example implementations in /examples/exported-code/
- Join our Discord for help and support
  `.trim();
}
