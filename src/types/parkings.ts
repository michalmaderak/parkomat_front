import { Manager } from './manager'; // Zaimportuj typ Managera

export interface Parking {
  parking_id: number; // lub string
  name: string;
  latitude: number | null;
  longitude: number | null;
  park_id: number; // lub string
  // NOWE POLA:
  imageUrl?: string; // Link do zdjęcia parkingu
  description?: string; // Krótki opis parkingu
  manager_id?: number | null; // ID managera, jeśli jest przechowywane bezpośrednio
  manager?: Manager | null; // Obiekt managera, jeśli jest zagnieżdżony lub pobierany osobno
}