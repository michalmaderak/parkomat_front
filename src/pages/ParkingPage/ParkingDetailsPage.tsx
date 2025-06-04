// src/pages/ParkingDetailsPage/ParkingDetailsPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ParkingDetailsPage.module.scss';
import { Park } from '../../types/parks';
import { Parking } from '../../types/parkings';
import { User } from '../../types/user';
import { parksApi } from '../../api/parksApi';
import { parkingsApi } from '../../api/parkingsApi';
import { managersApi } from '../../api/managersApi';
import { PlaceGroup } from '../../types/placeGroup';
import SingleParkingMap from '../../components/Map/SingleParkingMap';
import DatePicker from '../../components/DatePicker/DatePicker';
import { Plus } from 'lucide-react';
import ReservationCard from '../../components/ReservationCard/ReservationCard';
import ReservationModal from '../../components/ReservationModal/ReservationModal';
import ReservationSuccessModal from '../../components/ReservationSuccessModal/ReservationSuccessModal'; // Importujemy nowy modal sukcesu

import { reservationAPI, ReservationDto, PlaceGroupsRequestDto } from '../../api/reservationApi.ts';
import { format } from 'date-fns';
import axios from 'axios';

const placeTypesMap: Record<string, { label: string; icon: string }> = {
    car: { label: 'samochód osobowy', icon: '🚗' },
    bus: { label: 'autobus', icon: '🚌' },
    motorcycle: { label: 'motocykl', icon: '🏍️' },
};

const ParkingDetailsPage: React.FC = () => {
    const { parkingId } = useParams<{ parkingId: string }>();
    const [parking, setParking] = useState<Parking | null>(null);
    const [relatedPark, setRelatedPark] = useState<Park | null>(null);
    const [manager, setManager] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [selectedVehicles, setSelectedVehicles] = useState<Record<string, number>>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false); // Nowy stan dla modalu sukcesu
    const [reserveEmail, setReserveEmail] = useState<string>('');
    const [reservationMessage, setReservationMessage] = useState<string>('');

    useEffect(() => {
        if (!parkingId) {
            setError("Nieprawidłowy ID parkingu.");
            setIsLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            setError('');
            try {
                const parkingData = await parkingsApi.getById(parkingId);
                setParking(parkingData);

                if (parkingData.park_id) {
                    const parkDataResponse = await parksApi.getById(parkingData.park_id.toString());
                    setRelatedPark(parkDataResponse);
                }

                if (parkingData.manager) {
                    setManager(parkingData.manager);
                } else if (parkingData.manager_id) {
                    const managerDataResponse = await managersApi.getManagerById(parkingData.manager_id.toString());
                    setManager(managerDataResponse);
                }

            } catch (err: unknown) {
                let errorMessage = "Nie udało się pobrać szczegółów parkingu.";
                if (err instanceof Error) {
                    errorMessage += ` Błąd: ${err.message}`;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [parkingId]);

    const addVehicleSelection = (typeId: string) => {
        setSelectedVehicles(prev => ({
            ...prev,
            [typeId]: (prev[typeId] || 0) + 1,
        }));
    };

    const decreaseVehicleSelection = (typeId: string) => {
        setSelectedVehicles(prev => {
            const updated = { ...prev };
            if (updated[typeId] && updated[typeId] > 1) {
                updated[typeId] -= 1;
            } else {
                delete updated[typeId];
            }
            return updated;
        });
    };

    const removeVehicleSelection = (typeId: string) => {
        setSelectedVehicles(prev => {
            const updated = { ...prev };
            delete updated[typeId];
            return updated;
        });
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleOpenReservationModal = () => {
        if (totalSelectedVehicles > 0 && selectedDate) {
            setIsModalOpen(true);
            setReservationMessage('');
        } else {
            setReservationMessage('Wybierz datę i co najmniej jeden pojazd, aby kontynuować rezerwację.');
        }
    };

    const handleCloseReservationModal = () => {
        setIsModalOpen(false);
        setReservationMessage('');
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        setSelectedVehicles({});
        setSelectedDate(null);
        setReserveEmail('');
        setReservationMessage('');
    };

    const handleConfirmReservation = async (emailFromModal: string) => {
        setReserveEmail(emailFromModal);
        console.log('--- handleConfirmReservation wywołana! ---');
        console.log('parkingId:', parkingId);
        console.log('selectedDate:', selectedDate);
        console.log('totalSelectedVehicles:', Object.values(selectedVehicles).reduce((sum, val) => sum + val, 0));
        console.log('reserveEmail (z modalu):', emailFromModal);

        if (!parkingId) {
            console.log('handleConfirmReservation: Brak ID parkingu.');
            setReservationMessage('Błąd: Brak ID parkingu.');
            return;
        }
        if (!selectedDate) {
            console.log('handleConfirmReservation: Data rezerwacji nie wybrana.');
            setReservationMessage('Wybierz datę rezerwacji.');
            return;
        }
        if (Object.keys(selectedVehicles).length === 0) {
            console.log('handleConfirmReservation: Brak wybranych pojazdów.');
            setReservationMessage('Wybierz co najmniej jeden pojazd do rezerwacji.');
            return;
        }
        if (!emailFromModal.trim()) {
            console.log('handleConfirmReservation: Adres e-mail jest pusty.');
            setReservationMessage('Wprowadź swój adres e-mail.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(emailFromModal)) {
            console.log('handleConfirmReservation: Nieprawidłowy format adresu e-mail.');
            setReservationMessage('Wprowadź prawidłowy adres e-mail.');
            return;
        }

        const reservationsArray: PlaceGroupsRequestDto[] = Object.entries(selectedVehicles).map(([type, quantity]) => ({
            type: type,
            quantity: quantity,
        }));

        const reservationData: ReservationDto = {
            reservationStartDate: selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss") : '',
            reservationEndDate: selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss") : '',
            reserveEmail: emailFromModal,
            parkingId: parseInt(parkingId, 10),
            reservations: reservationsArray,
        };

        console.log('Dane rezerwacji do wysłania:', reservationData);

        try {
            setReservationMessage('Wysyłanie rezerwacji...');
            const response = await reservationAPI.createReservation(reservationData);
            console.log('Rezerwacja utworzona pomyślnie:', response);
            setReservationMessage('Rezerwacja została pomyślnie utworzona!');
            setSelectedVehicles({});
            setSelectedDate(null);
            setReserveEmail('');

            setIsModalOpen(false); // Zamknij modal rezerwacji
            setIsSuccessModalOpen(true); // Otwórz modal sukcesu

        } catch (err: unknown) {
            let errorMessage = "Nie udało się utworzyć rezerwacji.";
            if (axios.isAxiosError(err) && err.response) {
                errorMessage += ` Status: ${err.response.status}. Wiadomość: ${err.response.data.message || err.response.data}`;
            } else if (err instanceof Error) {
                errorMessage += ` Błąd: ${err.message}`;
            }
            console.error('Szczegóły błędu rezerwacji:', err);
            setReservationMessage(errorMessage); // Komunikat błędu zostanie wyświetlony w ReservationModal
        }
    };

    const totalSelectedVehicles = Object.values(selectedVehicles).reduce((sum, val) => sum + val, 0);

    const hasValidCoordinates = parking &&
        typeof parking.latitude === 'number' &&
        typeof parking.longitude === 'number' &&
        !isNaN(parking.latitude) &&
        !isNaN(parking.longitude);

    // Zmieniony kod dla ładowania
    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Ładowanie informacji o parkingu...</p>
            </div>
        );
    }
    if (error) return <p className={styles.error}>{error}</p>;
    if (!parking) return <p>Nie znaleziono parkingu.</p>;

    return (
        <div className={styles.parkingDetailsContainer}>
            <div className={styles.parkingInfoGrid}>
                <div className={styles.parkingMedia}>
                    <h3>{parking.name}</h3>
                    {parking.address && <p className={styles.parkingAddress}>{parking.address}</p>}
                    {parking.imageUrl && (
                        <img
                            src={parking.imageUrl}
                            alt={`Zdjęcie parkingu ${parking.name}`}
                            className={styles.parkingImage}
                        />
                    )}
                    {parking.description && (
                        <div className={styles.descriptionSection}>
                            <h4>Opis parkingu:</h4>
                            <p>{parking.description}</p>
                        </div>
                    )}

                    {parking.place_groups && parking.place_groups.length > 0 ? (
                        <div className={styles.placeGroupsSection}>
                            <h4>Dostępne typy miejsc:</h4>
                            <ul>
                                {parking.place_groups.map((group: PlaceGroup) => {
                                    const placeTypeInfo = placeTypesMap[group.type];
                                    return (
                                        <li key={group.group_id} className={styles.placeGroupItem}>
                                            <span className={styles.placeGroupIcon}>{placeTypeInfo?.icon}</span>
                                            <span className={styles.placeGroupType}>{placeTypeInfo?.label || group.type}:</span>
                                            <span className={styles.placeGroupQuantity}>{group.quantity} miejsc</span>
                                            <button
                                                onClick={() => addVehicleSelection(group.type)}
                                                className={styles.vehicleButton}
                                                title={`Dodaj ${placeTypeInfo?.label || group.type}`}
                                            >
                                                <Plus className={styles.plusIcon} />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <p>Brak informacji o typach miejsc dla tego parkingu.</p>
                    )}
                </div>

                <div>
                    {hasValidCoordinates ? (
                        <div className={styles.mapContainerWrapper}>
                            <h4>Lokalizacja na mapie:</h4>
                            <SingleParkingMap
                                latitude={parking.latitude as number}
                                longitude={parking.longitude as number}
                                popupText={parking.name}
                                zoom={16}
                                mapHeight="250px"
                            />
                        </div>
                    ) : (
                        <p>Brak danych o lokalizacji do wyświetlenia mapy.</p>
                    )}

                    {manager && (
                        <div className={styles.managerInfo}>
                            <h4>Informacje o zarządcy:</h4>
                            <p><strong>Imię i nazwisko:</strong> {manager.firstName} {manager.lastName}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${manager.email}`}>{manager.email}</a></p>
                            <p><strong>Telefon:</strong> <a href={`tel:${manager.phoneNumber}`}>{manager.phoneNumber}</a></p>
                        </div>
                    )}

                    {!manager && parking.manager_id && (
                        <p>Ładowanie informacji o managerze...</p>
                    )}
                    {!manager && !parking.manager_id && (
                        <p>Brak informacji o managerze.</p>
                    )}

                    <div className={styles.availabilitySection}>
                        <div className={styles.availabilityHeader}>
                            <h4>Wybierz datę i typ pojazdu:</h4>
                        </div>

                        <div className={styles.datePickerSection}>
                            <DatePicker
                                onDateSelect={handleDateChange}
                            />
                        </div>

                        <ReservationCard
                            selectedVehicles={selectedVehicles}
                            onRemoveVehicle={removeVehicleSelection}
                            onDecreaseVehicle={decreaseVehicleSelection}
                            totalSelectedVehicles={totalSelectedVehicles}
                            onOpenReservationModal={handleOpenReservationModal}
                        />

                        {reservationMessage && !isModalOpen && !isSuccessModalOpen && (
                            <p className={styles.reservationMessage}>{reservationMessage}</p>
                        )}

                    </div>
                </div>
            </div>
            <ReservationModal
                isOpen={isModalOpen}
                onClose={handleCloseReservationModal}
                onConfirmReservation={handleConfirmReservation}
                totalSelectedVehicles={totalSelectedVehicles}
                reservationMessage={reservationMessage} // Przekazujemy wiadomość do modalu
                parkingName={parking.name}
                selectedDate={selectedDate}
            />
            {/* Nowy modal sukcesu */}
            <ReservationSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
                email={reserveEmail} // Przekazujemy email, aby wyświetlić go w modalu
            />
        </div>
    );
};

export default ParkingDetailsPage;