'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from 'lib/supabaseClient'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'customer' | 'merchant'>('customer')
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    setError(null)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        role,
        city,
        plan: 'free'
      })
      router.push(`/dashboard/${role}`)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Registro</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select
        className="border p-2 w-full mb-2"
        value={role}
        onChange={(e) => setRole(e.target.value as 'customer' | 'merchant')}
      >
        <option value="customer">Cliente</option>
        <option value="merchant">Comercio</option>
      </select>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Registrarse
      </button>
    </div>
  )
}
