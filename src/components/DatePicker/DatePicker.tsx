import React, { useState } from 'react';
import './DatePicker.scss';

const DatePicker: React.FC = () => {
  const [arrivalDate, setArrivalDate] = useState<string>('2025-06-12');
  const [departureDate, setDepartureDate] = useState<string>('2025-06-12');
  const [tripType, setTripType] = useState<string>('Osobowy');

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleTripTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTripType(e.target.value);
  };

  return (
    <div className="date-picker-container">
      <div className="date-inputs">
        <div>
          <label>Data przyjazdu:</label>
          <input
            type="date"
            value={arrivalDate}
            onChange={handleDateChange(setArrivalDate)}
          />
        </div>
        <div>
          <label>Data wyjazdu:</label>
          <input
            type="date"
            value={departureDate}
            onChange={handleDateChange(setDepartureDate)}
          />
        </div>
        <div>
          <label>Rodzaj pojazdu:</label>
          <select value={tripType} onChange={handleTripTypeChange}>
            <option value="Osobowy">Osobowy</option>
            <option value="Ciężarowy">Ciężarowy</option>
          </select>
        </div>
      </div>
      <div className="parking-info">
        <h1>O naszym parkingu</h1>
      </div>
    </div>
  );
};

export default DatePicker;