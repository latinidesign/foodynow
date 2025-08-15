'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function MerchantDetail() {
  const params = useParams<{ id: string }>()
  const merchantId = params?.id ?? ''

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Dashboard Comercio</h2>
      <p>ID del comercio: {merchantId}</p>

      <div className="mt-4 space-y-2">
        <Link href={`/dashboard/merchant/merchants/${merchantId}/products`} className="text-blue-500">
          Ver Productos
        </Link>
        <Link href={`/dashboard/merchant/merchants/${merchantId}/products/create`} className="text-green-500">
          Crear Producto
        </Link>
      </div>
    </div>
  )
}
