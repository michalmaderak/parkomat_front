import axiosClient from "./axiosClient";

export interface Transaction {
  id?: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  notes?: string;
  tags?: string[]; 

}

export const transactionsApi = {
  getAll: async () => {
    const response = await axiosClient.get("/transactions");
    return response.data;
  },
  create: async (transaction: Transaction) => {
    const response = await axiosClient.post("/transactions", transaction);
    return response.data; // zwraca utworzoną transakcję z nadanym id
  },
};
