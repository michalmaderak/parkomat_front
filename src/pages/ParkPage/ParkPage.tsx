// src/pages/ParkPage/ParkPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ParkPage.module.scss';
import { Park } from '../../types/parks';
import { Parking } from '../../types/parkings';
import { parksApi } from '../../api/parksApi';
import { parkingsApi } from '../../api/parkingsApi';
import { PlaceGroup } from '../../types/placeGroup';
import { format } from 'date-fns';
import DatePicker from '../../components/DatePicker/DatePicker';

interface FreeSpotsDto {
    reservationCount: number;
    type: string;
}

interface ParkingReservedSpots {
    [parkingId: string]: Record<string, number>;
}

const API_BASE_URL = 'http://localhost:8080/api';

const placeTypesMap: Record<string, { label: string; icon: string }> = {
    car: { label: 'samochód osobowy', icon: '🚗' },
    bus: { label: 'autobus', icon: '🚌' },
    motocycle: { label: 'motocykl', icon: '🏍️' },
};

const ParkPage: React.FC = () => {
    const { parkId } = useParams<{ parkId: string }>();
    const [park, setPark] = useState<Park | null>(null);
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
    const [isLoadingPark, setIsLoadingPark] = useState<boolean>(true);
    const [isLoadingParkings, setIsLoadingParkArgs] = useState<boolean>(true);
    const [errorPark, setErrorPark] = useState<string>('');
    const [errorParkings, setErrorParkings] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [vehicleFilters, setVehicleFilters] = useState({
        car: false,
        bus: false,
        motocycle: false
    });

    const [reservedSpotsAllParkings, setReservedSpotsAllParkings] = useState<ParkingReservedSpots>({});
    const [isLoadingSpots, setIsLoadingSpots] = useState<boolean>(false);
    const [spotsError, setSpotsError] = useState<string>('');

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        let result = parkings;

        if (searchTerm) {
            result = result.filter(parking =>
                parking.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (vehicleFilters.car || vehicleFilters.bus || vehicleFilters.motocycle) {
            result = result.filter(parking => {
                const placeGroups = parking.place_groups || [];
                const parkingReserved = reservedSpotsAllParkings[parking.parking_id] || {};

                return (
                    (vehicleFilters.car && placeGroups.some(g => g.type === 'car' && ((g.quantity || 0) - (parkingReserved.car || 0)) > 0)) ||
                    (vehicleFilters.bus && placeGroups.some(g => g.type === 'bus' && ((g.quantity || 0) - (parkingReserved.bus || 0)) > 0)) ||
                    (vehicleFilters.motocycle && placeGroups.some(g => g.type === 'motocycle' && ((g.quantity || 0) - (parkingReserved.motocycle || 0)) > 0))
                );
            });
        }

        setFilteredParkings(result);
    }, [searchTerm, vehicleFilters, parkings, reservedSpotsAllParkings]);

    const handleVehicleFilterChange = (type: keyof typeof vehicleFilters) => {
        setVehicleFilters(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (!parkId) {
            setErrorPark("Nieprawidłowy ID parku.");
            setIsLoadingPark(false);
            setIsLoadingParkArgs(false);
            return;
        }

        const fetchParkDetails = async () => {
            setIsLoadingPark(true);
            setErrorPark('');
            try {
                const parkData = await parksApi.getById(parkId);
                setPark(parkData);
            } catch (err: unknown) {
                console.error("Błąd podczas pobierania danych parku:", err);
                let errorMessage = "Nie udało się pobrać danych parku.";
                if (err instanceof Error) {
                    errorMessage += ` Błąd: ${err.message}`;
                }
                setErrorPark(errorMessage);
                setPark(null);
            } finally {
                setIsLoadingPark(false);
            }
        };

        const fetchParkings = async () => {
            setIsLoadingParkArgs(true);
            setErrorParkings('');
            try {
                const parkingsData = await parkingsApi.getParkingsByParkId(parkId);
                setParkings(parkingsData);
            } catch (err: unknown) {
                console.error("Błąd podczas pobierania parkingów:", err);
                let errorMessage = "Nie udało się pobrać listy parkingów.";
                if (err instanceof Error) {
                    errorMessage += ` Błąd: ${err.message}`;
                }
                setErrorParkings(errorMessage);
                setParkings([]);
                setFilteredParkings([]);
            } finally {
                setIsLoadingParkArgs(false);
            }
        };

        fetchParkDetails();
        fetchParkings();
    }, [parkId]);

    useEffect(() => {
        const fetchAllAvailableSpots = async () => {
            if (parkings.length === 0 || !selectedDate) {
                setReservedSpotsAllParkings({});
                return;
            }

            setIsLoadingSpots(true);
            setSpotsError('');
            const currentReservedSpots: ParkingReservedSpots = {};
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');

            try {
                const promises = parkings.map(async (parking) => {
                    if (!parking.parking_id) return;

                    const parsedParkingId = parseInt(parking.parking_id.toString(), 10);
                    if (isNaN(parsedParkingId)) {
                        console.warn(`Nieprawidłowy ID parkingu dla pobierania: ${parking.parking_id}`);
                        return;
                    }

                    try {
                        const response = await fetch(
                            `${API_BASE_URL}/reservations/quantity/${parsedParkingId}?data=${formattedDate}`
                        );

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({ message: 'Nieznany błąd' }));
                            console.error(`Błąd HTTP dla parkingu ${parking.name} (${parking.parking_id}): ${response.status} - ${errorData.message || response.statusText}`);
                            return;
                        }

                        const data: FreeSpotsDto[] = await response.json();
                        const parkingSpots: Record<string, number> = {};
                        data.forEach(item => {
                            parkingSpots[item.type] = item.reservationCount;
                        });
                        currentReservedSpots[parking.parking_id.toString()] = parkingSpots;
                    } catch (err: any) {
                        console.error(`Błąd pobierania wolnych miejsc dla parkingu ${parking.name} (${parking.parking_id}):`, err);
                    }
                });

                await Promise.all(promises);
                setReservedSpotsAllParkings(currentReservedSpots);

            } catch (err: any) {
                let errorMessage = "Nie udało się pobrać danych o zajętych miejscach dla wszystkich parkingów.";
                if (err instanceof Error) {
                    errorMessage += ` Błąd: ${err.message}`;
                } else if (typeof err === 'string') {
                    errorMessage += ` Błąd: ${err}`;
                } else {
                    errorMessage += ` Nieznany błąd: ${JSON.stringify(err)}`;
                }
                setSpotsError(errorMessage);
                setReservedSpotsAllParkings({});
            } finally {
                setIsLoadingSpots(false);
            }
        };

        if (parkings.length > 0 && selectedDate) {
            fetchAllAvailableSpots();
        }
    }, [parkings, selectedDate]);

    if (isLoadingPark || isLoadingParkings) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Ładowanie danych...</p>
            </div>
        );
    }

    return (
        <div className={styles.parkPageContainer}>
            {errorPark && <p className={styles.error}>{errorPark}</p>}

            <div className={styles.grid}>
                <div className={styles.parkHeader}>
                    {park ? (
                        <>
                            <img
                                src={park.parkLogoLink}
                                alt={`Logo ${park.name}`}
                                className={styles.parkLogo}
                            />
                            <h1>{park.name}</h1>
                        </>
                    ) : (
                        !isLoadingPark && <p>Nie znaleziono informacji o parku.</p>
                    )}
                </div>

                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Szukaj parkingu..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className={styles.tags}>
                    <p className={styles.tagTitle}>filtruj według</p>

                    <div className={styles.filterGroup}>
                        <p className={styles.filterTitle}>Pojazd:</p>
                        <label>
                            <input
                                type="checkbox"
                                checked={vehicleFilters.car}
                                onChange={() => handleVehicleFilterChange('car')}
                            />
                            Samochód osobowy
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={vehicleFilters.bus}
                                onChange={() => handleVehicleFilterChange('bus')}
                            />
                            Autobus
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={vehicleFilters.motocycle}
                                onChange={() => handleVehicleFilterChange('motocycle')}
                            />
                            Motocykl
                        </label>
                    </div>

                    {/* Zmiana tutaj: Umieszczamy DatePicker bezpośrednio pod tytułem "Data" */}
                    <div className={styles.filterGroup}>
                        <DatePicker onDateSelect={handleDateSelect} />
                    </div>
                </div>

                <div className={styles.parkingsSection}>
                    <h2>Parkingi {filteredParkings.length !== parkings.length && `(${filteredParkings.length}/${parkings.length})`}</h2>
                    {errorParkings && <p className={styles.error}>{errorParkings}</p>}
                    {isLoadingSpots && <p className={styles.loadingSpots}>Sprawdzanie dostępności miejsc dla {selectedDate ? format(selectedDate, 'dd.MM.yyyy') : 'wybranej daty'}...</p>}
                    {spotsError && <p className={styles.error}>{spotsError}</p>}
                    {!isLoadingParkings && filteredParkings.length === 0 && !isLoadingSpots && (
                        <p>Brak dostępnych parkingów spełniających kryteria.</p>
                    )}
                    {filteredParkings.length > 0 && !isLoadingSpots ? (
                        <ul className={styles.parkingList}>
                            {filteredParkings.map((parking) => {
                                const parkingReservedSpots = reservedSpotsAllParkings[parking.parking_id] || {};

                                return (
                                    <li key={parking.parking_id} className={styles.parkingItem}>
                                        {parking.imageUrl && (
                                            <img
                                                src={parking.imageUrl}
                                                alt={`Zdjęcie parkingu ${parking.name}`}
                                                className={styles.parkingImage}
                                            />
                                        )}

                                        <div className={styles.parkingInfo}>
                                            <h3>{parking.name}</h3>
                                            {parking.address && (
                                                <p className={styles.parkingAddress}>{parking.address}</p>
                                            )}

                                            <h4>Dostępne typy miejsc:</h4>

                                            {parking.place_groups && parking.place_groups.length > 0 ? (
                                                <ul className={styles.placeGroupsList}>
                                                    {parking.place_groups.map((group: PlaceGroup) => {
                                                        const totalCapacity = group.quantity || 0;
                                                        const reservedCount = parkingReservedSpots[group.type] || 0;
                                                        const availableSpots = totalCapacity - reservedCount;
                                                        const placeTypeInfo = placeTypesMap[group.type];

                                                        return (
                                                                <><span className={styles.placeGroupType}>
                                                                {placeTypeInfo?.label || group.type}:
                                                            </span><span className={styles.placeGroupIcon}>
                                                                    {availableSpots > 0 ? '🟢' : '🔴'}
                                                                </span><span className={styles.placeGroupQuantity}>
                                                                    (Dostępnych: {availableSpots})
                                                                </span><br/></>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <p>Brak informacji o typach miejsc.</p>
                                            )}

                                            <div className={styles.buttonContainer}>
                                                <Link to={`/parking/${parking.parking_id}`} className={styles.reserveButtonLink}>
                                                    <button className={styles.reserveButton}>
                                                        Przejdź do rezerwacji
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null}
                </div>
            </div>
        </div >
    );
};

export default ParkPage;