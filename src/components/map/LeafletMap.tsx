// src/components/map/LeafletMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Arreglo de iconos por defecto (webpack issue)
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x.src,
  iconUrl: marker.src,
  shadowUrl: shadow.src
});

type MarkerItem = {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  rating: number | null;
};

export default function LeafletMap({
  cityCenter = [-34.6037, -58.3816], // CABA por defecto
  cityZoom = 12,
  queryString = ""
}: {
  cityCenter?: [number, number];
  cityZoom?: number;
  queryString?: string; // ?cityId=..&categoryId=..
}) {
  const [items, setItems] = useState<MarkerItem[]>([]);

  useEffect(() => {
    fetch(`/api/merchants${queryString ? `?${queryString}` : ""}`)
      .then((r) => r.json())
      .then((json) => setItems(json.items ?? []))
      .catch(console.error);
  }, [queryString]);

  const bounds = useMemo(() => {
    if (!items.length) return null;
    return L.latLngBounds(items.map(i => L.latLng(i.lat, i.lng)));
  }, [items]);

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={cityCenter}
        zoom={cityZoom}
        bounds={bounds ?? undefined}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
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
                    <Link
                      href={`/commerce/${m.slug}`}
                      className="text-sm underline"
                    >
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
