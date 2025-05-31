// src/api/parksApi.ts
import axiosClient from "./axiosClient";
import { Park } from "../types/parks"; // Upewnij się, że typ Park jest poprawnie zdefiniowany

export const parksApi = {
  // Istniejąca metoda pobierania wszystkich parków
  getAll: async (): Promise<Park[]> => { // Dodajmy typ zwracany dla jasności
    const response = await axiosClient.get<Park[]>("/parks"); // Określ typ oczekiwanej odpowiedzi
    return response.data;
  },

  // Istniejąca metoda tworzenia parku
  create: async (park: Omit<Park, 'id'>): Promise<Park> => { // Park bez 'id' przy tworzeniu, serwer nada ID
    const response = await axiosClient.post<Park>("/parks", park); // Określ typ oczekiwanej odpowiedzi
    return response.data;
  },

  // NOWA METODA: Pobieranie parku po ID
  getById: async (parkId: string | number): Promise<Park> => { // parkId może być stringiem z URL lub number
    // Endpoint zazwyczaj wygląda tak: /parks/123
    const response = await axiosClient.get<Park>(`/parks/${parkId}`); // Określ typ oczekiwanej odpowiedzi
    return response.data;
  },

  // Opcjonalnie: Metoda aktualizacji parku
  // update: async (parkId: string | number, parkData: Partial<Park>): Promise<Park> => {
  //   const response = await axiosClient.put<Park>(`/parks/${parkId}`, parkData);
  //   return response.data;
  // },

  // Opcjonalnie: Metoda usuwania parku
  // remove: async (parkId: string | number): Promise<void> => {
  //   await axiosClient.delete(`/parks/${parkId}`);
  //   // Zazwyczaj delete nie zwraca contentu, lub zwraca 204 No Content
  // },
};