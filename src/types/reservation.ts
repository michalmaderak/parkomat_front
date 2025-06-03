// src/types/reservation.ts

import { PlaceGroup } from "./placeGroup"; // Zakładając, że PlaceGroup jest już zdefiniowany

export interface Reservation {
    id: number; // ID rezerwacji z backendu
    reservationStartDate: string; // Data w formacie ISO string
    reservationEndDate: string;   // Data w formacie ISO string
    reserveEmail: string;
    parkingId: number;
    reservations: PlaceGroup[]; // Lista PlaceGroup, które zostały zarezerwowane
    // Dodaj inne pola, jeśli Twój model Reservation w Javie je posiada
    // np. createdAt: string;
    //     status: string;
}