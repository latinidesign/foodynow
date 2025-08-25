"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from 'lib/supabaseClient'

export default function NavBar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-semibold">FOODY NOW</Link>
        <Link href="/auth/login" className="text-blue-600">Login</Link>
        <Link href="/auth/register" className="text-blue-600">Registro</Link>
        <Link href="/dashboard/customer" className="text-blue-600">Dashboard Cliente</Link>
        <Link href="/dashboard/merchant" className="text-blue-600">Dashboard Comercio</Link>
      </div>
      <div className="text-sm">
        {userEmail ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-600">{userEmail}</span>
            <button onClick={handleLogout} className="text-red-600">Salir</button>
          </div>
        ) : (
          <span className="text-gray-500">No autenticado</span>
        )}
      </div>
    </nav>
  )
}
