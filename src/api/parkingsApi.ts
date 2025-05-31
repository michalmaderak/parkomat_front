// src/api/parkingsApi.ts (jeśli tworzysz nowy plik)
import axiosClient from "./axiosClient"; // Użyj tego samego axiosClient
import { Parking } from "../types/parkings"; // Zaimportuj typ Parking
import axios from 'axios';
export const parkingsApi = {
  getParkingsByParkId: async (parkId: string | number): Promise<Parking[]> => {
    // Endpoint może wyglądać tak: /api/parks/{parkId}/parkings
    // lub tak: /api/parkings?parkId={parkId}
    // Dostosuj do swojego backendu. Przykład dla pierwszego:
    const response = await axiosClient.get<Parking[]>(`/parks/${parkId}/parkings`);
    return response.data;
  },
  // DODAJ TĘ METODĘ:
  getById: async (parkingId: string | number): Promise<Parking> => {
    const res = await axios.get(`/api/parkings/${parkingId}`);
    return res.data;
  }
  // Możesz tu dodać inne operacje CRUD dla parkingów, jeśli potrzebujesz
  // createParking: async (parkingData: Omit<Parking, 'parking_id'>): Promise<Parking> => { ... }
  // updateParking: async (parkingId: string | number, parkingData: Partial<Parking>): Promise<Parking> => { ... }
  // deleteParking: async (parkingId: string | number): Promise<void> => { ... }
};