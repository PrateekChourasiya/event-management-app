import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon issues in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onLocationSelected }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationSelected) {
        onLocationSelected(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const MapPicker = ({ initialPosition, onLocationSelected }) => {
  const [position, setPosition] = useState(initialPosition || null);

  return (
    <div className="border-2 border-retro-light shadow-[4px_4px_0_#212529] mb-4">
      <div className="bg-retro-light text-white p-2 text-xs font-bold font-retro flex justify-between items-center">
        <span>📍 PIN THE VENUE LOCATION</span>
        {position && <span className="text-green-300">LOCATION SELECTED</span>}
      </div>
      <MapContainer 
        center={initialPosition || [51.505, -0.09]} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '300px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onLocationSelected={onLocationSelected} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
