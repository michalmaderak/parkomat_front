export interface MarkerData {
  id: number;
  position: [number, number];
  popupText: string;
}

export interface MapComponentProps {
  markers: MarkerData[];
}