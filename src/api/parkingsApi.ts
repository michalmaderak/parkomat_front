// src/api/parkingsApi.ts
import axiosClient from "./axiosClient";
import { Parking } from "../types/parkings"; // Zaimportuj typ Parking

export const parkingsApi = {
  getParkingsByParkId: async (parkId: string | number): Promise<Parking[]> => {
    // Endpoint może wyglądać tak: /api/parks/{parkId}/parkings
    // lub tak: /api/parkings?parkId={parkId}
    // Dostosuj do swojego backendu. Przykład dla pierwszego:
    const response = await axiosClient.get<Parking[]>(`/parks/${parkId}/parkings`);
    return response.data;
  },

  getById: async (parkingId: string | number): Promise<Parking> => {
    // Endpoint dla pojedynczego parkingu to zazwyczaj /api/parkings/{parkingId}
    const res = await axiosClient.get(`/parkings/${parkingId}`);
    return res.data;
  },
  async update(id: number, data: Parking): Promise<Parking> { // Zmieniono typ ID na number
        // Przyjmujemy, że endpoint do aktualizacji to PUT /api/parkings/{id}
        // Upewnij się, że backend jest w stanie przyjąć zaktualizowany obiekt Parking
        const response = await axiosClient.put<Parking>(`/parkings/${id}`, data);
        return response.data;
    },
  // Zaktualizowana metoda: Pobieranie parkingów dla danego MENADŻERA
  // Teraz endpoint API to /api/managers/{managerId}/parkings
  getParkingsByManagerId: async (managerId: string | number): Promise<Parking[]> => { // Zmieniono nazwę parametru na managerId
    try {
      // Zmieniono ścieżkę z '/owners/' na '/managers/'
      const response = await axiosClient.get<Parking[]>(`/managers/${managerId}/parkings`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania parkingów dla menadżera ${managerId}:`, error); // Zaktualizowano komunikat
      throw error; // Przekaż błąd dalej
    }
  },

  // ... (pozostałe metody, jeśli są)
};