// src/app/api/facets/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 120;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cityId = searchParams.get("cityId");
  if (!cityId) return NextResponse.json({ items: [] });

  const { data, error } = await supabase
    .rpc("facet_category_counts_by_city", { p_city_id: Number(cityId) });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [] });
}

// src/app/api/facets/route.ts ya creado arriba
// Consumo rápido (client) dentro de FilterBar o en un "SidebarFacets" separado:
async function fetchFacets(cityId: number) {
  const res = await fetch(`/api/facets?cityId=${cityId}`, { next: { revalidate: 120 } });
  const json = await res.json();
  return json.items as { category_id: number; total: number }[];
}
