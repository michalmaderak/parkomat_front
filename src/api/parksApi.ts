import axiosClient from "./axiosClient";
import { Park } from "../types/parks";

export const parksApi = {
  getAll: async () => {
    const response = await axiosClient.get("/parks");
    
    return response.data; 
  },
  create: async (park: Park) => {
    const response = await axiosClient.post("/parks", park);
    return response.data; 
  },
};
