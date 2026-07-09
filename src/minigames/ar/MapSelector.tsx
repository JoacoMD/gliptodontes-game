import { useState } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';

import { Button } from '@/components/ui/Button';
import { fossilsAR } from '@/data/fossilsAR';

interface MapSelectorProps {
  onLocationSelected: (
    location: google.maps.LatLngLiteral,
  ) => void;
}

const center = {
  lat: -34.9214,
  lng: -57.9544,
};

export function MapSelector({
  onLocationSelected,
}: MapSelectorProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [marker, setMarker] =
    useState<google.maps.LatLngLiteral | null>(null);

  if (!isLoaded) return <>Cargando mapa...</>;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{
          width: '100%',
          height: '100%',
        }}
        zoom={15}
        options={{
          disableDefaultUI: true,
        }}
        center={center}
        onClick={(e) => {
          if (!e.latLng) return;

          setMarker({
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          });
        }}
      >
        {fossilsAR.flatMap((fossil) =>
          fossil.locations.map((location, index) => (
            <Marker
              key={`${fossil.id}-${index}`}
              position={{
                lat: location.lat,
                lng: location.lng,
              }}
              title={fossil.name}
              icon={{
                url: '/assets/ui/map-marker.png',
                scaledSize: new google.maps.Size(42, 42)
              }}
            />
          ))
        )}
        {marker && (
          <Marker position={marker} />
        )}
      </GoogleMap>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Button
          disabled={!marker}
          onClick={() => {
            if (marker) {
              onLocationSelected(marker);
            }
          }}
        >
          Comenzar
        </Button>
      </div>
    </div>
  );
}
