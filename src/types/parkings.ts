import { User } from './user';
import { PlaceGroup } from './placeGroup';
export interface Parking {
  parking_id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  park_id: number;
  imageUrl?: string | null;
  address?: string;
  description?: string;
  manager_id?: number | null;
  manager?: User | null;

  place_groups?: PlaceGroup[];
}


