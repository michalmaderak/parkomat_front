import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";


const defaultIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41] 
});

// Typy dla propsów komponentu
interface SingleParkingMapProps {
  latitude: number | null;
  longitude: number | null;
  popupText?: string;      
  zoom?: number;     
  mapHeight?: string;  
  mapWidth?: string;     
  dragging?: boolean;
  zoomControl?: boolean;
  scrollWheelZoom?: boolean;
}

const SingleParkingMap: React.FC<SingleParkingMapProps> = ({
  latitude,
  longitude,
  popupText,
  zoom = 15, // Domyślny zoom
  mapHeight = "350px", // Domyślna wysokość
  mapWidth = "100%",   // Domyślna szerokość
  dragging = true,
  zoomControl = true,
  scrollWheelZoom = true,
}) => {
  if (latitude === null || longitude === null) {
    return <div style={{ padding: "20px", textAlign: "center", border: "1px solid red" }}>
      Brak współrzędnych do wyświetlenia mapy.
    </div>;
  }
  // Klucz dla MapContainer, aby wymusić re-render, jeśli współrzędne się zmienią
  const mapKey = `${latitude}-${longitude}`;
  const centerPosition: [number, number] = [latitude, longitude];

  // Sprawdzenie, czy współrzędne są prawidłowymi liczbami
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("SingleParkingMap: Invalid latitude or longitude provided.");
    return <div style={{ padding: "20px", textAlign: "center", border: "1px solid red" }}>Nieprawidłowe współrzędne dla mapy.</div>;
  }

  return (
    <MapContainer
      key={mapKey}
      center={centerPosition}
      zoom={zoom}
      style={{ height: mapHeight, width: mapWidth, borderRadius: "8px", overflow: "hidden" }}
      dragging={dragging}
      zoomControl={zoomControl}
      scrollWheelZoom={scrollWheelZoom}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={centerPosition} icon={defaultIcon}>
        {popupText && <Popup>{popupText}</Popup>}
      </Marker>
    </MapContainer>
  );
};

export default SingleParkingMap;