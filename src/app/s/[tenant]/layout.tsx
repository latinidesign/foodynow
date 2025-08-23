import 'server-only';
import { ReactNode } from 'react';
import { getCommerceBySlug } from '@/lib/tenant';
import { notFound } from 'next/navigation';

export default async function TenantLayout({
  children,
  params,
}: { children: ReactNode, params: { tenant: string } }) {
  const commerce = await getCommerceBySlug(params.tenant);
  if (!commerce) notFound();
  return (
    <div className="min-h-screen">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">{commerce.name}</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
