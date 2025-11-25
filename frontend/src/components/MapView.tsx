import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShipmentData } from '../utils/excelParser';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  shipments: ShipmentData[];
}

function MapView({ shipments }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([51.505, -0.09], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add markers for shipments (simplified - would need geocoding in production)
    shipments.slice(0, 50).forEach((shipment) => {
      // Simple marker placement (in production, use geocoding)
      const lat = 51.505 + (Math.random() - 0.5) * 0.1;
      const lng = -0.09 + (Math.random() - 0.5) * 0.1;

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          `<div>
            <strong>${shipment.id}</strong><br/>
            ${shipment.collectionLocation} → ${shipment.deliveryLocation}<br/>
            ${shipment.carrier} - ${shipment.transportMode}
          </div>`
        );
    });

    return () => {
      // Cleanup handled by React
    };
  }, [shipments]);

  if (shipments.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No shipments to display
        </h3>
        <p className="text-gray-500">
          Upload an Excel file to see shipments on the map
        </p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-[600px]" />
    </div>
  );
}

export default MapView;

