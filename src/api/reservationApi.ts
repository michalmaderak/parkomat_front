// src/api/reservationAPI.ts

import axiosClient from "./axiosClient"; // Użyj tego samego axiosClient

// Definicja interfejsu dla PlaceGroupsRequestDto
// Upewnij się, że ścieżka do tego typu jest poprawna, jeśli istnieje w innym miejscu
export interface PlaceGroupsRequestDto {
    type: string; // np. 'car', 'bus', 'motorcycle'
    quantity: number;
}

// Definicja interfejsu dla ReservationDto, zgodna z Twoim backendem
export interface ReservationDto {
    reservationStartDate: string; // Data w formacie ISO (np. "2023-10-27T10:00:00.000Z")
    reservationEndDate: string;   // lub Date, ale zazwyczaj backend preferuje string
    reserveEmail: string;
    parkingId: number; // Zmieniono na number, zgodnie z Twoim backendem (Long w Javie)
    reservations: PlaceGroupsRequestDto[];
}

// Definicja interfejsu dla odpowiedzi z backendu (np. Reservation model)
// Upewnij się, że masz odpowiedni typ Reservation w Twoich typach
import { Reservation } from '../types/reservation'; // Załóżmy, że masz ten typ

export const reservationAPI = {
    /**
     * Tworzy nową rezerwację w systemie.
     * Endpoint: POST /api/reservations
     * @param reservationData Dane rezerwacji do wysłania.
     * @returns Promise z listą utworzonych rezerwacji.
     */
    createReservation: async (reservationData: ReservationDto): Promise<Reservation[]> => {
        try {
            const response = await axiosClient.post<Reservation[]>('/reservations', reservationData);
            return response.data;
        } catch (error) {
            console.error('Błąd podczas tworzenia rezerwacji:', error);
            throw error; // Przekaż błąd dalej do obsługi w komponencie
        }
    },

    /**
     * Pobiera wszystkie rezerwacje.
     * Endpoint: GET /api/reservations
     * @returns Promise z listą wszystkich rezerwacji.
     */
    getAllReservations: async (): Promise<Reservation[]> => {
        try {
            const response = await axiosClient.get<Reservation[]>('/reservations');
            return response.data;
        } catch (error) {
            console.error('Błąd podczas pobierania rezerwacji:', error);
            throw error;
        }
    },

    /**
     * Pobiera rezerwację po ID.
     * Endpoint: GET /api/reservations/{id}
     * @param id ID rezerwacji.
     * @returns Promise z obiektem rezerwacji.
     */
    getReservationById: async (id: number | string): Promise<Reservation> => {
        try {
            const response = await axiosClient.get<Reservation>(`/reservations/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Błąd podczas pobierania rezerwacji o ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Aktualizuje istniejącą rezerwację.
     * Endpoint: PUT /api/reservations/{id}
     * @param id ID rezerwacji do zaktualizowania.
     * @param updatedReservationData Zaktualizowane dane rezerwacji.
     * @returns Promise z zaktualizowanym obiektem rezerwacji.
     */
    updateReservation: async (id: number | string, updatedReservationData: Reservation): Promise<Reservation> => {
        try {
            const response = await axiosClient.put<Reservation>(`/reservations/${id}`, updatedReservationData);
            return response.data;
        } catch (error) {
            console.error(`Błąd podczas aktualizacji rezerwacji o ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Usuwa rezerwację po ID.
     * Endpoint: DELETE /api/reservations/{id}
     * @param id ID rezerwacji do usunięcia.
     * @returns Promise, która rozwiązuje się po usunięciu.
     */
    deleteReservation: async (id: number | string): Promise<void> => {
        try {
            await axiosClient.delete(`/reservations/${id}`);
        } catch (error) {
            console.error(`Błąd podczas usuwania rezerwacji o ID ${id}:`, error);
            throw error;
        }
    },
    
};