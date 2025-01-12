import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';


const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false, // Disable server-side rendering
});

export default function MapWrapper({ accommodations, location, radius }) {
  // Ensure Leaflet styles are included
  useEffect(() => {
    import('leaflet/dist/leaflet.css');
  }, []);

  return <DynamicMap accommodations={accommodations} location={location} radius={radius}/>;
}
