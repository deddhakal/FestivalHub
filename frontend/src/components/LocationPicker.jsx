import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapController({ centerPos }) {
  const map = useMap();
  useEffect(() => {
    if (centerPos && centerPos[0] && centerPos[1]) {
      map.flyTo(centerPos, 16);
    }
  }, [centerPos, map]);
  return null;
}

export default function LocationPicker({ lat, lng, onChange }) {
  const position = lat && lng ? [lat, lng] : [-37.7983, 144.9610];
  
  function MapEvents() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div className="flex flex-col gap-3 mt-2 w-full">
      <div className="min-h-[250px] h-[40vh] max-h-96 w-full rounded-3xl overflow-hidden border-2 border-ink-tertiary/20 z-0 relative shadow-inner">
        <MapContainer center={position} zoom={16} className="h-full w-full bg-surface-1" aria-label="Interactive map for location selection">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <MapEvents />
          <MapController centerPos={lat && lng ? [lat, lng] : null} />
          {lat && lng && <Marker position={[lat, lng]} icon={defaultIcon} />}
        </MapContainer>
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm text-ink-secondary pointer-events-none border border-surface-border">
          🖱️ Click map to drop pin exactly
        </div>
      </div>
    </div>
  );
}
