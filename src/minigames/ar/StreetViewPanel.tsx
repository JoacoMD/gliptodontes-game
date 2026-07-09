import { useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

interface StreetViewPanelProps {
  initialPosition: google.maps.LatLngLiteral;
  onReady?: (
    panorama: google.maps.StreetViewPanorama,
  ) => void;
}

export function StreetViewPanel({
  initialPosition,
  onReady,
}: StreetViewPanelProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!isLoaded || !ref.current) return;

    const panorama = new google.maps.StreetViewPanorama(
      ref.current,
      {
        position: initialPosition,
        pov: {
          heading: 0,
          pitch: 0,
        },
        zoom: 1,
        disableDefaultUI: true,
        addressControl: false,
        linksControl: false,
        panControl: false,
        zoomControl: false,
        clickToGo: true,
      },
    );

    onReady?.(panorama);
  }, [isLoaded, initialPosition]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
