// src/components/map/LeafletMap.tsx
'use client'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import type { LatLngExpression, LeafletMouseEvent, Map as LeafletMapType } from 'leaflet'
import { useRef } from 'react'

type MarkerItem = { id: string; position: LatLngExpression; title?: string }

type LeafletMapProps = {
  center: LatLngExpression
  markers?: MarkerItem[]
  onClick?: (coords: { lat: number; lng: number }) => void
  zoom?: number
  className?: string
}

function ClickCatcher({ onClick }: { onClick?: (c: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onClick?.({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

export default function LeafletMap({
  center,
  markers = [],
  onClick,
  zoom = 13,
  className = 'h-full w-full',
}: LeafletMapProps) {
  const mapRef = useRef<LeafletMapType | null>(null)

  return (
    <MapContainer center={center} zoom={zoom} className={className} whenCreated={(map) => (mapRef.current = map)}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((m) => (
        <Marker key={m.id} position={m.position}>
          {m.title ? <Popup>{m.title}</Popup> : null}
        </Marker>
      ))}
      <ClickCatcher onClick={onClick} />
    </MapContainer>
  )
}
