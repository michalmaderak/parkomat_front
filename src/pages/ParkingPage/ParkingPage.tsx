import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { parkingsApi } from '../../api/parkingsApi';
import { Parking } from '../../types/parkings';

const ParkingPage: React.FC = () => {
  const { parkingId } = useParams<{ parkingId: string }>();
  const [parking, setParking] = useState<Parking | null>(null);

  useEffect(() => {
    if (parkingId) {
      parkingsApi.getById(parkingId).then(setParking).catch(console.error);
    }
  }, [parkingId]);

  if (!parking) return <p>Ładowanie danych parkingu...</p>;

  return (
    <div>
      <h1>{parking.name}</h1>
      <p>Współrzędne: {parking.latitude}, {parking.longitude}</p>
      {/* Dodaj więcej szczegółów jak potrzeba */}
      <p><strong>Zarządca:</strong> {parking.manager.first_name} {parking.manager.last_name}</p>
      <p><strong>Telefon:</strong> {parking.manager.phone}</p>
      <p><strong>Email:</strong> {parking.manager.email}</p>
    </div>
  );
};

export default ParkingPage;