'use client'
import Link from 'next/link'

export default function MerchantDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Comercio</h1>
      <p>Bienvenido al panel de comercio.</p>

      <div className="mt-4 space-y-2">
        <Link href="/dashboard/merchant/merchants" className="text-blue-500">
          Mis Comercios
        </Link>
        <Link href="/dashboard/merchant/merchants/create" className="text-green-500">
          Crear Nuevo Comercio
        </Link>
      </div>
    </div>
  )
}
