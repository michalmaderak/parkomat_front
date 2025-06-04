import { User } from './user'; // Zaimportuj typ Managera
import { PlaceGroup } from './placeGroup'; // <--- IMPORTUJ NOWY TYP
export interface Parking {
  parking_id: number; // lub string
  name: string;
  latitude: number | null;
  longitude: number | null;
  park_id: number; // lub string
  // NOWE POLA:
  imageUrl?: string | null;  // <--- DODANE/UPEWNIJ SIĘ, ŻE JEST
  address?: string;  // <--- DODANE
  description?: string; // Krótki opis parkingu
  manager_id?: number | null; // ID managera, jeśli jest przechowywane bezpośrednio
  manager?: User | null; // Obiekt managera, jeśli jest zagnieżdżony lub pobierany osobno

  place_groups?: PlaceGroup[]; // <--- NOWE POLE
}