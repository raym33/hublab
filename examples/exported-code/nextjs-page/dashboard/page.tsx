// Dashboard page with data fetching - Next.js 14
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR('/api/stats', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data?.stats.map((stat: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
