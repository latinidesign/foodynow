// app/api/merchants/route.ts
import { NextRequest, NextResponse } from 'next/server'
// Si tenés tipos generados de Supabase, importalos:
import type { Database } from '@/lib/database.types'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // o KEY que uses en server
)

type CreateMerchantBody = {
  name: string
  category: string
  city: string
  lat?: number
  lng?: number
}

function isCreateMerchantBody(v: unknown): v is CreateMerchantBody {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  return typeof o.name === 'string' && typeof o.category === 'string' && typeof o.city === 'string'
}

export async function POST(req: NextRequest) {
  const raw: unknown = await req.json()   // 👈 nunca uses any, usá unknown
  if (!isCreateMerchantBody(raw)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { name, category, city, lat, lng } = raw

  const { data, error } = await supabase
    .from('merchants')
    .insert([{ name, category, city, lat, lng }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
