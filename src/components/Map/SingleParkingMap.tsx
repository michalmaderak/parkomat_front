// src/components/Map/SingleParkingMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css"; // Importuj style Leaflet
import L from "leaflet";

// Importuj ikony markerów (aby uniknąć problemów z domyślną ikoną)
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png"; // Opcjonalnie dla HiDPI

// Skonfiguruj domyślną ikonę Leaflet
const defaultIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl, // Dla ekranów HiDPI
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],    // Rozmiar ikony
  iconAnchor: [12, 41],   // Punkt ikony odpowiadający lokalizacji markera
  popupAnchor: [1, -34],  // Punkt, od którego powinien otwierać się popup względem iconAnchor
  shadowSize: [41, 41]    // Rozmiar cienia
});

// Typy dla propsów komponentu
interface SingleParkingMapProps {
  latitude: number | null; // Zmiana - pozwól na null
  longitude: number | null; // Zmiana - pozwól na null
  // ... reszta propsów
  popupText?: string;        // Opcjonalny tekst dla dymka (Popup)
  zoom?: number;             // Opcjonalny poziom zoomu, domyślnie np. 15
  mapHeight?: string;        // Opcjonalna wysokość mapy (np. "400px")
  mapWidth?: string;         // Opcjonalna szerokość mapy (np. "100%")
  // Dodatkowe opcje Leaflet, które możesz chcieć kontrolować
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
  // (choć dla tego komponentu, który przyjmuje lat/lng, zmiana propsów powinna wystarczyć)
  const mapKey = `${latitude}-${longitude}`;
  const centerPosition: [number, number] = [latitude, longitude];

  // Sprawdzenie, czy współrzędne są prawidłowymi liczbami
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("SingleParkingMap: Invalid latitude or longitude provided.");
    return <div style={{ padding: "20px", textAlign: "center", border: "1px solid red" }}>Nieprawidłowe współrzędne dla mapy.</div>;
  }

  return (
    <MapContainer
      key={mapKey} // Klucz może pomóc w niektórych przypadkach aktualizacji
      center={centerPosition}
      zoom={zoom}
      style={{ height: mapHeight, width: mapWidth, borderRadius: "8px", overflow: "hidden" }} // Dodaj border-radius i overflow
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