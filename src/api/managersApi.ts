import axiosClient from "./axiosClient";
import { User } from "../types/user";

export const managersApi = {
  getManagerById: async (managerId: string | number): Promise<User> => {
    const response = await axiosClient.get<User>(`/managers/${managerId}`); // Załóżmy taki endpoint
    return response.data;
  },
};