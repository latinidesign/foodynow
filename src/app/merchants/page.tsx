import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

// Lista de comercios (App Router) con filtros por querystring ?city=&category=
export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: { city?: string | string[]; category?: string | string[] }
}) {
  const city = typeof searchParams?.city === 'string' ? searchParams.city : ''
  const category = typeof searchParams?.category === 'string' ? searchParams.category : ''

  let query = supabase
    .from('merchants')
    .select('id,name,slug,city,category')
    .order('name', { ascending: true })

  if (city) query = query.eq('city', city)
  if (category) query = query.eq('category', category)

  const { data: merchants, error } = await query

  if (error) {
    // En un caso real se podría loguear y mostrar un estado de error más amigable
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Comercios</h1>
        <p className="text-red-600">Ocurrió un error al cargar los comercios.</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Comercios</h1>

      <div className="text-sm text-gray-600 mb-6">
        Ciudad: {city || 'Todas'} · Categoría: {category || 'Todas'}
      </div>

      {!merchants || merchants.length === 0 ? (
        <p>No hay comercios con esos filtros.</p>
      ) : (
        <ul className="space-y-3">
          {merchants.map((m) => (
            <li key={m.id} className="border rounded p-3">
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-600">{m.city} · {m.category}</div>
              <Link href={`/merchants/${m.slug}`} className="text-blue-600 mt-1 inline-block">
                Ver detalles →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
