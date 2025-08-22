// src/app/api/merchants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Tipos de filas
interface MerchantBaseRow {
  id: number | string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  rating: number | null;
  city_id: number | null;
}
interface MerchantJoinedRow extends MerchantBaseRow {
  merchant_categories: { category_id: number }[];
}

type MerchantRow = MerchantBaseRow | MerchantJoinedRow;

// Helper: lee ambos nombres de query (cityId/city, categoryId/category)
function readId(params: URLSearchParams, keys: string[]) {
  for (const k of keys) {
    const v = params.get(k);
    if (v && /^\d+$/.test(v)) return Number(v);
  }
  return undefined;
}

function isJoined(row: MerchantRow): row is MerchantJoinedRow {
  return Array.isArray((row as any).merchant_categories);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = readId(searchParams, ["cityId", "city"]);
  const categoryId = readId(searchParams, ["categoryId", "category"]);
  const limit = Number(searchParams.get("limit") ?? 500);

  // Base query tipada sin join
  let baseQuery = supabase
    .from("merchants")
    .select(`id, name, slug, latitude, longitude, rating, city_id`)
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .limit(limit);

  if (cityId) baseQuery = baseQuery.eq("city_id", cityId);

  let data: MerchantRow[] | null = null
  let fetchError: any = null

  if (categoryId) {
    let joinQuery = supabase
      .from("merchants")
      .select(
        `id, name, slug, latitude, longitude, rating, city_id, merchant_categories!inner(category_id)`
      )
      .eq("merchant_categories.category_id", categoryId)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .limit(limit);
    if (cityId) joinQuery = joinQuery.eq("city_id", cityId);
    const res = await joinQuery
    data = res.data as MerchantRow[] | null
    fetchError = res.error
  } else {
    const res = await baseQuery
    data = res.data as MerchantRow[] | null
    fetchError = res.error
  }

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  const items = (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    lat: m.latitude,
    lng: m.longitude,
    rating: m.rating ?? null,
    cityId: m.city_id ?? null,
    categories: isJoined(m) ? m.merchant_categories.map(c => c.category_id) : undefined,
  }));

  return NextResponse.json({ items });
}
