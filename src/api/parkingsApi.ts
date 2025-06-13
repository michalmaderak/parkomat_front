import axiosClient from "./axiosClient";
import { Parking } from "../types/parkings";

export const parkingsApi = {
  getParkingsByParkId: async (parkId: string | number): Promise<Parking[]> => {

    const response = await axiosClient.get<Parking[]>(`/parks/${parkId}/parkings`);
    return response.data;
  },

  getById: async (parkingId: string | number): Promise<Parking> => {

    const res = await axiosClient.get(`/parkings/${parkingId}`);
    return res.data;
  },
  async update(id: number, data: Parking): Promise<Parking> {

        const response = await axiosClient.put<Parking>(`/parkings/${id}`, data);
        return response.data;
    },

  getParkingsByManagerId: async (managerId: string | number): Promise<Parking[]> => {
    try {

      const response = await axiosClient.get<Parking[]>(`/managers/${managerId}/parkings`);
      return response.data;
    } catch (error) {
      console.error(`Błąd podczas pobierania parkingów dla menadżera ${managerId}:`, error);
      throw error; // Przekaż błąd dalej
    }
  },

};