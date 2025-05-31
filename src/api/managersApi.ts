import axiosClient from "./axiosClient";
import { Manager } from "../types/manager";

export const managersApi = {
  getManagerById: async (managerId: string | number): Promise<Manager> => {
    const response = await axiosClient.get<Manager>(`/managers/${managerId}`); // Załóżmy taki endpoint
    return response.data;
  },
};