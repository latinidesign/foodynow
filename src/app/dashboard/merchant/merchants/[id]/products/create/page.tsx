'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CreateProduct() {
  const params = useParams<{ id: string }>()
  const merchantId = params?.id
  const router = useRouter()

  const [name, setName] = useState('')
  const [price, setPrice] = useState<number>(0)

  const handleCreate = async () => {
    if (!merchantId) return
    await supabase.from('products').insert({
      merchant_id: merchantId,
      name,
      price
    })
    router.push(`/dashboard/merchant/merchants/${merchantId}/products`)
  }

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Crear Producto</h2>
      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-2"
        disabled={!merchantId}
      >
        Crear Producto
      </button>
    </div>
  )
}
