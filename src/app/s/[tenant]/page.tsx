import 'server-only';
import { getCommerceBySlug } from '@/lib/tenant';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function StorefrontHome({ params }: { params: { tenant: string }}) {
  const commerce = await getCommerceBySlug(params.tenant);
  if (!commerce) return null;

  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id,name,price,currency,slug,is_published')
    .eq('commerce_id', commerce.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {(products ?? []).map(p => (
        <article key={p.id} className="p-4 border rounded-2xl">
          <h3 className="font-medium">{p.name}</h3>
          <p className="text-sm">{p.price} {p.currency}</p>
        </article>
      ))}
    </section>
  );
}
