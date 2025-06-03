// src/components/DatePicker/DatePicker.tsx

import React, { useState } from 'react';
import './DatePicker.scss';

// Zmieniamy interfejs propów, aby przyjmował funkcję callback
interface DatePickerProps {
    onDateSelect: (date: Date) => void; // Funkcja, która zostanie wywołana z wybraną datą (Data przyjazdu)
    // Opcjonalnie, jeśli chcesz by DatePicker miał początkową wartość z zewnątrz:
    // initialDate?: Date | null;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect /*, initialDate */ }) => {
    // Ustawiamy stan początkowy na dzisiejszą datę lub jakąś domyślną, aby przycisk mógł się aktywować
    // Możemy to zrobić w formacie YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const [arrivalDate, setArrivalDate] = useState<string>(today);
    const [departureDate, setDepartureDate] = useState<string>(today); // Domyślnie ta sama, dla uproszczenia

    // Wywołujemy callback, gdy data przyjazdu się zmienia
    const handleArrivalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDateString = e.target.value;
        setArrivalDate(newDateString);
        // Konwertujemy string na obiekt Date i przekazujemy do komponentu nadrzędnego
        onDateSelect(new Date(newDateString));
    };

    const handleDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepartureDate(e.target.value);
        // Na razie nie przekazujemy daty wyjazdu do komponentu nadrzędnego,
        // ponieważ ParkingDetailsPage oczekuje tylko jednej `selectedDate` dla rezerwacji.
        // Jeśli chcesz obsługiwać zakres, musisz to zmienić w ParkingDetailsPage.
    };

    return (
        <div className="date-picker-container">
            <div className="date-inputs">
                <div>
                    <label>Data przyjazdu:</label>
                    <input
                        type="date"
                        value={arrivalDate}
                        onChange={handleArrivalDateChange} // Używamy nowego handlera
                    />
                </div>
                <div>
                    <label>Data wyjazdu:</label>
                    <input
                        type="date"
                        value={departureDate}
                        onChange={handleDepartureDateChange}
                    />
                </div>
            </div>
            {/* Usunięcie selektora typu podróży, jeśli nie jest używany */}
            {/* <div className="trip-type">
                <label>Typ podróży:</label>
                <select value={tripType} onChange={handleTripTypeChange}>
                    <option value="Osobowy">Osobowy</option>
                    <option value="Biznesowy">Biznesowy</option>
                </select>
            </div> */}
        </div>
    );
};

export default DatePicker;