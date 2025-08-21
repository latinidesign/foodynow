'use client';
import dynamic from 'next/dynamic';

// Importa el default del módulo LeafletMap.tsx (que ahora exporta MapView como default)
const LeafletMapClient = dynamic(() => import('./LeafletMap'), { ssr: false });

export default LeafletMapClient;
