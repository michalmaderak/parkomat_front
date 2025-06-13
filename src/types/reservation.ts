import { PlaceGroup } from "./placeGroup";

export interface Reservation {
    id: number;
    reservationStartDate: string;
    reservationEndDate: string;
    reserveEmail: string;
    parkingId: number;
    reservations: PlaceGroup[];
}