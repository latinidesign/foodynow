// src/app/merchants/maps/page.tsx
import { createClient } from '@supabase/supabase-js';
import FilterBar from '@/components/filters/FilterBar';
import LeafletMap from '@/components/map/LeafletMap';

export const metadata = {
  title: 'Mapa de comercios | Foody Now',
  description: 'Explorá comercios por ciudad y categoría.',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams
  const [{ data: cities }, { data: categories }] = await Promise.all([
    supabase.from('cities').select('id, name, province').order('name'),
    supabase.from('categories').select('id, name').order('name'),
  ]);

  const cityId = typeof sp.cityId === 'string' ? sp.cityId : undefined;
  const categoryId = typeof sp.categoryId === 'string' ? sp.categoryId : undefined;

  const queryString = new URLSearchParams(
    Object.fromEntries(Object.entries({ cityId, categoryId }).filter(([, v]) => !!v)) as Record<string, string>
  ).toString();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Comercios en el mapa</h1>

      <FilterBar
        cities={cities ?? []}
        categories={categories ?? []}
        defaultCityId={cityId ? Number(cityId) : undefined}
        defaultCategoryId={categoryId ? Number(categoryId) : undefined}
      />

      {/* Renderiza el mapa como Client Component */}
      <LeafletMap queryString={queryString} />
    </main>
  );
}
