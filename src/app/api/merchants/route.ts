// src/app/api/merchants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper: lee ambos nombres de query (cityId/city, categoryId/category)
function readId(params: URLSearchParams, keys: string[]) {
  for (const k of keys) {
    const v = params.get(k);
    if (v && /^\d+$/.test(v)) return Number(v);
  }
  return undefined;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = readId(searchParams, ["cityId", "city"]);
  const categoryId = readId(searchParams, ["categoryId", "category"]);
  const limit = Number(searchParams.get("limit") ?? 500);

  // Base: merchants con coordenadas
  let query = supabase
    .from("merchants")
    .select(`id, name, slug, latitude, longitude, rating, city_id`)
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(limit);

  if (cityId) query = query.eq("city_id", cityId);

  // Si hay categoría, hacemos join interno con N:M
  if (categoryId) {
    query = supabase
      .from("merchants")
      .select(`
        id, name, slug, latitude, longitude, rating, city_id,
        merchant_categories!inner(category_id)
      `)
      .eq("merchant_categories.category_id", categoryId)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .limit(limit);
    if (cityId) query = query.eq("city_id", cityId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).map((m: any) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    lat: m.latitude,
    lng: m.longitude,
    rating: m.rating ?? null,
    cityId: m.city_id
  }));

  return NextResponse.json({ items });
}
