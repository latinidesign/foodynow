// src/app/commerce/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // ISR: rehidrata cada 60s

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Merchant = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  address: string | null;
  rating: number | null;
  photos: string[] | null;
  city_id: number | null;
  latitude: number | null;
  longitude: number | null;
  cities?: { name: string; province: string } | null;
};

export async function generateStaticParams() {
  // Pre-render de los primeros N comercios (paginado si hace falta)
  const { data } = await supabase
    .from("merchants")
    .select("slug")
    .limit(500); // ajustá según tu tamaño
  return (data ?? []).map((m) => ({ slug: m.slug }));
}

async function getMerchant(slug: string): Promise<Merchant | null> {
  const { data, error } = await supabase
    .from("merchants")
    .select(`
      id, slug, name, description, address, rating, photos, latitude, longitude,
      city_id,
      cities:cities!merchants_city_id_fkey ( name, province )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) console.error(error);
  return data ?? null;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const merchant = await getMerchant(params.slug);
  if (!merchant) notFound();

  const cityLine = merchant.cities
    ? `${merchant.cities.name}, ${merchant.cities.province}`
    : "";

  const directionsHref = merchant.latitude && merchant.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`
    : merchant.address
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(merchant.address + ' ' + cityLine)}`
      : undefined;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{merchant.name}</h1>
      {merchant.rating != null && (
        <p className="mt-1 text-sm">⭐ {merchant.rating.toFixed(1)}</p>
      )}

      {merchant.address && (
        <p className="mt-2 text-sm text-gray-600">
          📍 {merchant.address} {cityLine && `— ${cityLine}`}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        {(merchant.photos ?? []).slice(0, 6).map((src, i) => (
          <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={`${merchant.name} foto ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {directionsHref && (
        <div className="mt-6">
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cómo llegar
          </a>
        </div>
      )}
    </main>
  );
}
