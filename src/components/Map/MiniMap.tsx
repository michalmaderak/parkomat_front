//src\components\Map\MiniMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapComponentProps } from "../../types/map";
// Fix default marker icon issue in Leaflet + Webpack
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set custom Leaflet marker icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Define the type for marker props


const MiniMapComponent: React.FC<MapComponentProps> = ({ markers }) => {
  return (
    <MapContainer center={[52.05, 19.017]} zoom={7} dragging={false} zoomControl={false} scrollWheelZoom={false} style={{ height: "900px", width: "900px" }}>
      <TileLayer
        url="http://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={customIcon}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MiniMapComponent;