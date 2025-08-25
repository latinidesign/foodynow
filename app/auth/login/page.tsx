'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from 'lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setError(null)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      setError(signInError.message)
      return
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user?.id)
      .single()

    router.push(`/dashboard/${userProfile?.role}`)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Iniciar sesión</h1>
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
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-4 py-2"
      >
        Entrar
      </button>
    </div>
  )
}
