'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SelectCityPage() {
  const router = useRouter()
  const [city, setCity] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSaveCity = async () => {
    setError(null)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      setError('No se encontró el usuario')
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ city })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    // Obtener el rol para dirigirlo al dashboard correcto
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    router.push(`/dashboard/${profile?.role}`)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Selecciona tu ciudad</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="border p-2 w-full mb-2"
        placeholder="Ciudad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        onClick={handleSaveCity}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Guardar ciudad
      </button>
    </div>
  )
}
