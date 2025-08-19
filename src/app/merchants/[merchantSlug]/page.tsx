import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export const revalidate = 60

export default async function MerchantDetail({
  params,
}: {
  params: Promise<{ merchantSlug: string }>
}) {
  const { merchantSlug } = await params

  const { data: merchant, error } = await supabase
    .from('merchants')
    .select('id,name,slug,city,category,description')
    .eq('slug', merchantSlug)
    .single()

  if (error || !merchant) return notFound()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{merchant.name}</h1>
      <div className="text-gray-600 mb-4">{merchant.city} · {merchant.category}</div>
      <p className="mb-6">{merchant.description || 'Sin descripción'}</p>
      <Link href="/merchants" className="text-blue-600">← Volver</Link>
    </div>
  )
}
