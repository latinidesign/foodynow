// src/components/filters/FilterBar.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

type City = { id: number; name: string; province: string };
type Category = { id: number; name: string };

export default function FilterBar({
  cities,
  categories,
  defaultCityId,
  defaultCategoryId
}: {
  cities: City[];
  categories: Category[];
  defaultCityId?: number | null;
  defaultCategoryId?: number | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsObj = useMemo(() => {
    const obj: Record<string, string> = {};
    searchParams.forEach((v, k) => (obj[k] = v));
    return obj;
  }, [searchParams]);

  const setParam = useCallback((key: string, value?: string) => {
    const sp = new URLSearchParams(paramsObj);
    if (!value) sp.delete(key);
    else sp.set(key, value);
    // Mantener página actual, reemplazar query (sin recargar)
    router.replace(`${pathname}?${sp.toString()}`);
  }, [paramsObj, pathname, router]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4 mb-4">
      {/* Ciudad */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Ciudad</label>
        <select
          className="border rounded px-3 py-2"
          defaultValue={defaultCityId ?? ""}
          onChange={(e) => setParam("cityId", e.target.value || undefined)}
        >
          <option value="">Todas</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}, {c.province}
            </option>
          ))}
        </select>
      </div>

      {/* Categoría */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Categoría</label>
        <select
          className="border rounded px-3 py-2"
          defaultValue={defaultCategoryId ?? ""}
          onChange={(e) => setParam("categoryId", e.target.value || undefined)}
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        className="border rounded px-3 py-2"
        onClick={() => router.replace(pathname)}
      >
        Limpiar filtros
      </button>
    </div>
  );
}
