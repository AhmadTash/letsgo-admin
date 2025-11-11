'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { NoSsr } from '@/components/core/no-ssr';

// Dynamically import the entire map to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Import Leaflet CSS
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
}

export interface LocationMapProps {
  coordinates?: string | null;
  locationDetails?: string | null;
  height?: string | number;
}

function MapContent({ lat, lng, locationDetails }: { lat: number; lng: number; locationDetails?: string | null }): React.JSX.Element {
  const [icon, setIcon] = React.useState<any>(null);

  React.useEffect(() => {
    // Load Leaflet icon only on client side
    import('leaflet').then((L) => {
      const leafletIcon = L.default.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setIcon(leafletIcon);
    });
  }, []);

  if (!icon) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        {locationDetails ? (
          <Popup>
            {locationDetails}
          </Popup>
        ) : null}
      </Marker>
    </MapContainer>
  );
}

export function LocationMap({ coordinates, locationDetails, height = 400 }: LocationMapProps): React.JSX.Element | null {
  // Parse coordinates from string format "lat,lng"
  const [lat, lng] = React.useMemo(() => {
    if (!coordinates) return [null, null];
    const parts = coordinates.split(',').map((part) => parseFloat(part.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return [null, null];
  }, [coordinates]);

  if (!lat || !lng) {
    return null;
  }

  return (
    <NoSsr fallback={<div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>}>
      <div style={{ height, width: '100%' }}>
        <MapContent lat={lat} lng={lng} locationDetails={locationDetails} />
      </div>
    </NoSsr>
  );
}

