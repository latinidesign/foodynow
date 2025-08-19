// src/app/api/merchants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("cityId");
  const categoryId = searchParams.get("categoryId");
  const limit = Number(searchParams.get("limit") ?? 500);

  // Base query
  let query = supabase
    .from("merchants")
    .select(`
      id, name, slug, latitude, longitude, rating, city_id
    `)
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(limit);

  // Por ciudad
  if (cityId) query = query.eq("city_id", Number(cityId));

  // Por categoría (N:M con join interno)
  if (categoryId) {
    query = supabase
      .from("merchants")
      .select(`
        id, name, slug, latitude, longitude, rating, city_id,
        merchant_categories!inner(category_id)
      `)
      .eq("merchant_categories.category_id", Number(categoryId))
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .limit(limit);

    if (cityId) query = query.eq("city_id", Number(cityId));
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
