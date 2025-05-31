export interface Parking {
  parking_id: number; // lub string jeśli backend zwraca bigint jako string
  name: string;
  latitude: number | null;  // bigint może być problematyczny, idealnie byłoby to float/double
  longitude: number | null; // podobnie jak wyżej
  manager_id: number | null;
  park_id: number; // lub string
}
