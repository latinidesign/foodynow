'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

// Fix de íconos por defecto de Leaflet en bundlers
// Si TS se queja por .png, agrega un declarations.d.ts con:  declare module '*.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: (marker2x as any).src ?? (marker2x as any),
  iconUrl: (marker as any).src ?? (marker as any),
  shadowUrl: (shadow as any).src ?? (shadow as any),
});

type MarkerItem = {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  rating: number | null;
};

interface MerchantsApiResponse {
  items?: MarkerItem[];
}

export default function MapView({
  cityCenter = [-34.6037, -58.3816] as [number, number], // CABA por defecto
  cityZoom = 12,
  queryString = '',
}: {
  cityCenter?: [number, number];
  cityZoom?: number;
  queryString?: string;
}) {
  const [items, setItems] = useState<MarkerItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(
          `/api/merchants${queryString ? `?${queryString}` : ''}`
        );
        if (!res.ok) return;
        const json: MerchantsApiResponse = await res.json();
        if (!cancelled) setItems(json.items ?? []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  const bounds = useMemo(() => {
    if (!items.length) return null;
    return L.latLngBounds(items.map((i) => L.latLng(i.lat, i.lng)));
  }, [items]);

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={cityCenter}
        zoom={cityZoom}
        bounds={bounds ?? undefined}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map((m) => {
          const directions = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;
          return (
            <Marker position={[m.lat, m.lng]} key={m.id}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-medium">{m.name}</div>
                  {m.rating != null && <div>⭐ {m.rating.toFixed(1)}</div>}
                  <div className="flex gap-2 mt-2">
                    <Link href={`/commerce/${m.slug}`} className="text-sm underline">
                      Ver perfil
                    </Link>
                    <a
                      href={directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      Cómo llegar
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
