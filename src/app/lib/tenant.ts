import 'server-only';
import { headers } from 'next/headers';
import { supabaseAdmin } from './supabaseAdmin';

export async function getTenantSlug(): Promise<string | null> {
  const h = headers();
  return h.get('x-tenant') ?? null; // seteado en middleware
}

export async function getCommerceBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('commerces')
    .select('*')
    .eq('subdomain', slug)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data;
}
