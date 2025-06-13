import React, { useState } from 'react';
import './DatePicker.scss';

// Zmieniamy interfejs propów, aby przyjmował funkcję callback
interface DatePickerProps {
    onDateSelect: (date: Date) => void; // Funkcja, która zostanie wywołana z wybraną datą (Data przyjazdu)

}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect /*, initialDate */ }) => {
    // Ustawiamy stan początkowy na dzisiejszą datę lub jakąś domyślną, aby przycisk mógł się aktywować

    const today = new Date().toISOString().split('T')[0];
    const [arrivalDate, setArrivalDate] = useState<string>(today);
    const [departureDate, setDepartureDate] = useState<string>(today); 

    // Wywołujemy callback, gdy data przyjazdu się zmienia
    const handleArrivalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDateString = e.target.value;
        setArrivalDate(newDateString);
        // Konwertujemy string na obiekt Date i przekazujemy do komponentu nadrzędnego
        onDateSelect(new Date(newDateString));
    };

    const handleDepartureDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepartureDate(e.target.value);

    };

    return (
        <div className="date-picker-container">
            <div className="date-inputs">
                <div>
                    <label>Data przyjazdu:</label>
                    <input
                        type="date"
                        value={arrivalDate}
                        onChange={handleArrivalDateChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DatePicker;