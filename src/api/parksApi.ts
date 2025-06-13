import axiosClient from "./axiosClient";
import { Park } from "../types/parks";

export const parksApi = {
  getAll: async (): Promise<Park[]> => { 
    const response = await axiosClient.get<Park[]>("/parks"); 
    return response.data;
  },

  // Istniejąca metoda tworzenia parku
  create: async (park: Omit<Park, 'id'>): Promise<Park> => { // Park bez 'id' przy tworzeniu, serwer nada ID
    const response = await axiosClient.post<Park>("/parks", park); 
    return response.data;
  },

  // NOWA METODA: Pobieranie parku po ID
  getById: async (parkId: string | number): Promise<Park> => { // parkId może być stringiem z URL lub number
    const response = await axiosClient.get<Park>(`/parks/${parkId}`);
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