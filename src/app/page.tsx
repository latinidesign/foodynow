'use client'
import Link from "next/link";
import NavBar from '@/components/NavBar'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [cities, setCities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true)
      // Ciudades únicas
      const { data: cityData } = await supabase
        .from('merchants')
        .select('city')
        .not('city', 'is', null)

      // Categorías únicas
      const { data: catData } = await supabase
        .from('merchants')
        .select('category')
        .not('category', 'is', null)

      if (cityData) setCities([...new Set(cityData.map((c: any) => c.city))])
      if (catData) setCategories([...new Set(catData.map((c: any) => c.category))])
      setLoading(false)
    }

    fetchFilters()
  }, [])

  return (
    <div className="font-sans min-h-screen p-8 pb-20">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8">FOODY NOW</h1>

      <h2 className="text-2xl mb-4">Filtrar Comercios</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-xl">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        >
          <option value="">Todas las ciudades</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        {loading ? 'Cargando filtros…' : `Ciudad: ${city || 'Todas'} · Categoría: ${category || 'Todas'}`}
      </div>

      <div>
        <Link
          href={{ pathname: '/merchants', query: { city, category } }}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Ver comercios
        </Link>
      </div>
    </div>
  )
}
