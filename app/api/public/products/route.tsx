import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  const tenant = req.headers.get('x-tenant') ?? req.nextUrl.searchParams.get('t');
  if (!tenant) return NextResponse.json({ error: 'tenant missing' }, { status: 400 });

  const { data: commerce, error: cErr } = await supabaseAdmin
    .from('commerces')
    .select('id,is_active')
    .eq('subdomain', tenant).single();
  if (cErr || !commerce?.is_active) return NextResponse.json([], { status: 200 });

  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q');

  let query = supabaseAdmin
    .from('products')
    .select('id,name,price,currency,slug')
    .eq('commerce_id', commerce.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (q) query = query.ilike('name', `%${q}%`);

  const { data } = await query;
  return NextResponse.json(data ?? []);
}
