/**
 * HubLab Data Integration Templates
 *
 * Ready-to-use templates for connecting HubLab components to real data sources.
 * 
 * Supported integrations:
 * 1. REST API (with SWR)
 * 2. Supabase (PostgreSQL)
 * 3. GraphQL (Apollo Client)
 * 4. Firebase (Firestore)
 * 5. State Management (Zustand)
 * 6. Form Handling (React Hook Form + Zod)
 * 7. Authentication (NextAuth.js)
 */

// REST API Template with SWR
export const REST_API_TEMPLATE = `
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useApiData<T>(endpoint: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    endpoint,
    fetcher,
    {
      refreshInterval: 30000,  // Auto-refresh every 30 seconds
      revalidateOnFocus: true, // Refresh when window regains focus
      revalidateOnReconnect: true,
    }
  );

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
}
`;

// Supabase Template
export const SUPABASE_TEMPLATE = `
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchData(table: string) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export function useRealtimeData(table: string) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const subscription = supabase
      .channel(table)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        (payload) => {
          setData(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table]);

  return data;
}
`;

// GraphQL Template
export const GRAPHQL_TEMPLATE = `
import { ApolloClient, InMemoryCache, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

const GET_DATA = gql\`
  query GetData {
    items {
      id
      name
      description
    }
  }
\`;

export function useGraphQLData() {
  const { loading, error, data } = useQuery(GET_DATA);
  
  return {
    data: data?.items || [],
    isLoading: loading,
    isError: error,
  };
}
`;

// State Management Template (Zustand)
export const STATE_MANAGEMENT_TEMPLATE = `
import { create } from 'zustand';

interface AppState {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id) 
  })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, ...updates } : i)
  })),
}));
`;

// Form Handling Template (React Hook Form + Zod)
export const FORM_HANDLING_TEMPLATE = `
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof formSchema>;

export function useFormValidation() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        reset();
        return { success: true };
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}
`;

// Authentication Template (NextAuth)
export const AUTH_TEMPLATE = `
import NextAuth from 'next-auth';
import { useSession, signIn, signOut } from 'next-auth/react';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
};

export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn,
    signOut,
  };
}
`;

export const DATA_INTEGRATION_TEMPLATES = {
  'rest-api': REST_API_TEMPLATE,
  'supabase': SUPABASE_TEMPLATE,
  'graphql': GRAPHQL_TEMPLATE,
  'state-management': STATE_MANAGEMENT_TEMPLATE,
  'form-handling': FORM_HANDLING_TEMPLATE,
  'authentication': AUTH_TEMPLATE,
};
