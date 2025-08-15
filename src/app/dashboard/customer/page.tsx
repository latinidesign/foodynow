'use client'
import Link from 'next/link'

export default function CustomerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Cliente</h1>
      <p>Bienvenido al panel de cliente.</p>

      <div className="mt-4">
        <Link href="/dashboard/customer/search-merchants" className="text-blue-500">
          Buscar comercios por ciudad
        </Link>
      </div>
    </div>
  )
}
