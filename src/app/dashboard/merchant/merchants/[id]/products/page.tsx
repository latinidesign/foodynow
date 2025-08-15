'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Product = {
  id: string
  name: string
  price: number
}

export default function ProductList() {
  const params = useParams()
  const merchantId = params.id
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id,name,price')
        .eq('merchant_id', merchantId)
      if (data) setProducts(data)
    }
    fetchProducts()
  }, [merchantId])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Productos del Comercio</h2>
      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  )
}
