import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  nip: string;
  accountNumber: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || "Błąd rejestracji";
      }
      throw new Error("Błąd rejestracji");
    }
  },
  
  login: async (data: LoginData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data?.message || "Nieprawidłowe dane logowania";
      }
      throw new Error("Błąd logowania");
    }
  }
};
