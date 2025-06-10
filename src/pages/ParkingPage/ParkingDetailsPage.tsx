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
import ReservationSuccessModal from '../../components/ReservationSuccessModal/ReservationSuccessModal';

import { reservationAPI, ReservationDto, PlaceGroupsRequestDto } from '../../api/reservationApi.ts';
import { format } from 'date-fns';
import axios from 'axios';

// NOWY TYP: Odpowiedź z endpointu daily-vehicle-counts
interface FreeSpotsDto {
    reservationCount: number;
    type: string;
}

const placeTypesMap: Record<string, { label: string; icon: string }> = {
    car: { label: 'samochód osobowy', icon: '🚗' },
    bus: { label: 'autobus', icon: '🚌' },
    motocycle: { label: 'motocykl', icon: '🏍️' },
};

// Adres bazowy Twojego backendu
const API_BASE_URL = 'http://localhost:8080/api';

const ParkingDetailsPage: React.FC = () => {
    const { parkingId } = useParams<{ parkingId: string }>();
    const [parking, setParking] = useState<Parking | null>(null);
    const [relatedPark, setRelatedPark] = useState<Park | null>(null);
    const [manager, setManager] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [selectedVehicles, setSelectedVehicles] = useState<Record<string, number>>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    const [reserveEmail, setReserveEmail] = useState<string>('');
    const [reservationMessage, setReservationMessage] = useState<string>('');

    const [reservedSpotsDaily, setReservedSpotsDaily] = useState<Record<string, number>>({});
    const [isLoadingSpots, setIsLoadingSpots] = useState<boolean>(false);
    const [spotsError, setSpotsError] = useState<string>('');

    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Efekt do pobierania szczegółów parkingu i powiązanych danych
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


    // Efekt do pobierania wolnych miejsc na podstawie wybranej daty i parkingu
    useEffect(() => {
        const fetchAvailableSpots = async () => {
            if (!parkingId || !selectedDate) {
                setReservedSpotsDaily({});
                return;
            }

            setIsLoadingSpots(true);
            setSpotsError('');
            try {
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                const parsedParkingId = parseInt(parkingId, 10);

                const response = await fetch(
                    `${API_BASE_URL}/reservations/quantity/${parsedParkingId}?data=${formattedDate}`
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Nieznany błąd' }));
                    throw new Error(`Błąd HTTP: ${response.status} - ${errorData.message || response.statusText}`);
                }

                const data: FreeSpotsDto[] = await response.json();

                const newReservedSpots: Record<string, number> = {};
                data.forEach(item => {
                    newReservedSpots[item.type] = item.reservationCount;
                });
                setReservedSpotsDaily(newReservedSpots);
            } catch (err: any) {
                let errorMessage = "Nie udało się pobrać danych o zajętych miejscach.";
                if (err instanceof Error) {
                    errorMessage += ` Błąd: ${err.message}`;
                } else if (typeof err === 'string') {
                    errorMessage += ` Błąd: ${err}`;
                } else {
                    errorMessage += ` Nieznany błąd: ${JSON.stringify(err)}`;
                }
                setSpotsError(errorMessage);
                console.error('Błąd pobierania wolnych miejsc (fetch):', err);
                setReservedSpotsDaily({});
            } finally {
                setIsLoadingSpots(false);
            }
        };

        fetchAvailableSpots();
    }, [parkingId, selectedDate]);

    // Efekt do przeliczania całkowitej ceny
    useEffect(() => {
        let currentTotalPrice = 0;
        // Zastosuj optional chaining i nullish coalescing dla bezpieczeństwa
        parking?.place_groups?.forEach(group => { // Access place_groups only if parking is not null/undefined
            const quantity = selectedVehicles[group.type] || 0;
            // Sprawdź, czy group.price jest liczbą przed użyciem
            if (typeof group.price === 'number') {
                currentTotalPrice += quantity * group.price;
            }
        });
        setTotalPrice(parseFloat(currentTotalPrice.toFixed(2)));
    }, [selectedVehicles, parking]); // Zależności: przeliczaj, gdy zmienią się wybrane pojazdy lub dane parkingu


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
        setSelectedVehicles({}); // Resetuj wybrane pojazdy przy zmianie daty
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
        // Po zamknięciu modala sukcesu, odśwież dane o wolnych miejscach
        if (parkingId && selectedDate) {
            const fetchAvailableSpotsAfterReservation = async () => {
                if (!parkingId || !selectedDate) return;
                setIsLoadingSpots(true);
                setSpotsError('');
                try {
                    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                    const parsedParkingId = parseInt(parkingId, 10);
                    const response = await fetch(
                        `${API_BASE_URL}/reservations/quantity/${parsedParkingId}?data=${formattedDate}`
                    );
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: 'Nieznany błąd' }));
                        throw new Error(`Błąd HTTP: ${response.status} - ${errorData.message || response.statusText}`);
                    }
                    const data: FreeSpotsDto[] = await response.json();
                    const newReservedSpots: Record<string, number> = {};
                    data.forEach(item => {
                        newReservedSpots[item.type] = item.reservationCount;
                    });
                    setReservedSpotsDaily(newReservedSpots);
                } catch (err: any) {
                    console.error('Błąd odświeżania wolnych miejsc po rezerwacji:', err);
                } finally {
                    setIsLoadingSpots(false);
                }
            };
            fetchAvailableSpotsAfterReservation();
        }
    };

    const handleConfirmReservation = async (emailFromModal: string) => {
        setReserveEmail(emailFromModal);
        console.log('--- handleConfirmReservation wywołana! ---');
        console.log('parkingId:', parkingId);
        console.log('selectedDate:', selectedDate);
        console.log('totalSelectedVehicles:', Object.values(selectedVehicles).reduce((sum, val) => sum + val, 0));
        console.log('reserveEmail (z modalu):', emailFromModal);
        console.log('totalPrice (w momencie rezerwacji):', totalPrice);

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
            totalPrice: parseFloat(totalPrice.toFixed(2)),
        };

        console.log('Dane rezerwacji do wysłania:', reservationData);

        try {
            setReservationMessage('Wysyłanie rezerwacji...');
            const response = await reservationAPI.createReservation(reservationData);
            console.log('Rezerwacja utworzona pomyślnie:', response);
            setReservationMessage('Rezerwacja została pomyślnie utworzona!');
            setSelectedVehicles({});
            setReserveEmail('');

            setIsModalOpen(false);
            setIsSuccessModalOpen(true);

            if (parkingId && selectedDate) {
                const fetchAvailableSpotsAfterReservation = async () => {
                    if (!parkingId || !selectedDate) return;
                    setIsLoadingSpots(true);
                    setSpotsError('');
                    try {
                        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                        const parsedParkingId = parseInt(parkingId, 10);
                        const updatedResponse = await fetch(
                            `${API_BASE_URL}/reservations/quantity/${parsedParkingId}?data=${formattedDate}`
                        );

                        if (!updatedResponse.ok) {
                            const errorData = await updatedResponse.json().catch(() => ({ message: 'Nieznany błąd' }));
                            throw new Error(`Błąd HTTP: ${updatedResponse.status} - ${errorData.message || updatedResponse.statusText}`);
                        }
                        const updatedData: FreeSpotsDto[] = await updatedResponse.json();

                        const newReservedSpots: Record<string, number> = {};
                        updatedData.forEach(item => {
                            newReservedSpots[item.type] = item.reservationCount;
                        });
                        setReservedSpotsDaily(newReservedSpots);
                    } catch (err: any) {
                        console.error('Błąd odświeżania wolnych miejsc po rezerwacji:', err);
                    } finally {
                        setIsLoadingSpots(false);
                    }
                };
                fetchAvailableSpotsAfterReservation();
            }

        } catch (err: any) {
            let errorMessage = "Nie udało się utworzyć rezerwacji.";
            if (axios.isAxiosError(err) && err.response) {
                errorMessage += ` Status: ${err.response.status}. Wiadomość: ${err.response.data.message || err.response.data}`;
            } else if (err instanceof Error) {
                errorMessage += ` Błąd: ${err.message}`;
            } else if (typeof err === 'string') {
                errorMessage += ` Błąd: ${err}`;
            } else {
                errorMessage += ` Nieznany błąd: ${JSON.stringify(err)}`;
            }
            console.error('Szczegóły błędu rezerwacji:', err);
            setReservationMessage(errorMessage);
        }
    };

    const totalSelectedVehicles = Object.values(selectedVehicles).reduce((sum, val) => sum + val, 0);

    const hasValidCoordinates = parking &&
        typeof parking.latitude === 'number' &&
        typeof parking.longitude === 'number' &&
        !isNaN(parking.latitude) &&
        !isNaN(parking.longitude);

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

                    {/* Check if parking.place_groups exists before trying to access its length */}
                    {parking.place_groups && parking.place_groups.length > 0 ? (
                        <div className={styles.placeGroupsSection}>
                            <h4>Dostępne typy miejsc:</h4>
                            {isLoadingSpots && <p className={styles.loadingSpots}>Ładowanie dostępności miejsc...</p>}
                            {spotsError && <p className={styles.error}>{spotsError}</p>}
                            {!isLoadingSpots && !spotsError && (
                                <ul>
                                    {/* Use optional chaining here as well for safety */}
                                    {parking.place_groups?.map((group: PlaceGroup) => {
                                        const placeTypeInfo = placeTypesMap[group.type];
                                        const totalCapacity = group.quantity || 0;
                                        const reservedCount = reservedSpotsDaily[group.type] || 0;
                                        const availableSpots = totalCapacity - reservedCount;
                                        const spotPrice = group.price || 0;

                                        return (
                                            <li key={group.group_id} className={styles.placeGroupItem}>
                                                <span className={styles.placeGroupIcon}>{placeTypeInfo?.icon}</span>
                                                <span className={styles.placeGroupType}>{placeTypeInfo?.label || group.type}:</span>
                                                <span className={styles.placeGroupQuantity}>
                                                    {availableSpots > 0
                                                        ? `${availableSpots} wolnych miejsc`
                                                        : 'Brak wolnych miejsc'}
                                                </span>
                                                <span className={styles.placeGroupType}>
                                                    {spotPrice > 0
                                                        ? `Cena: ${spotPrice.toFixed(2)} złotych`
                                                        : 'Brak informacji o cenie'}
                                                </span>
                                                <button
                                                    onClick={() => addVehicleSelection(group.type)}
                                                    className={styles.vehicleButton}
                                                    title={`Dodaj ${placeTypeInfo?.label || group.type}`}
                                                    disabled={availableSpots <= 0 || (selectedVehicles[group.type] || 0) >= availableSpots}
                                                >
                                                    <Plus className={styles.plusIcon} />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
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
                                //selectedDate={selectedDate}
                            />
                        </div>

                        <ReservationCard
                            selectedVehicles={selectedVehicles}
                            onRemoveVehicle={removeVehicleSelection}
                            onDecreaseVehicle={decreaseVehicleSelection}
                            totalSelectedVehicles={totalSelectedVehicles}
                            totalSelectedSpotPrices={totalPrice}
                            onOpenReservationModal={handleOpenReservationModal}
                            // Pass parking.place_groups as an empty array if undefined
                            parkingPlaceGroups={parking.place_groups || []}
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
                totalPrice={totalPrice}
                reservationMessage={reservationMessage}
                parkingName={parking.name}
                selectedDate={selectedDate}
            />
            <ReservationSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
                email={reserveEmail}
            />
        </div>
    );
};

export default ParkingDetailsPage;