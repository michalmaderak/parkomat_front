import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ParkPage.module.scss';
import { Park } from '../../types/parks';
import { Parking } from '../../types/parkings';
import { parksApi } from '../../api/parksApi';
import { parkingsApi } from '../../api/parkingsApi';
import { PlaceGroup } from '../../types/placeGroup';

const ParkPage: React.FC = () => {
    const { parkId } = useParams<{ parkId: string }>();
    const [park, setPark] = useState<Park | null>(null);
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
    const [isLoadingPark, setIsLoadingPark] = useState<boolean>(true);
    const [isLoadingParkings, setIsLoadingParkings] = useState<boolean>(true);
    const [errorPark, setErrorPark] = useState<string>('');
    const [errorParkings, setErrorParkings] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [vehicleFilters, setVehicleFilters] = useState({
        car: false,
        bus: false,
        motorcycle: false
    });
    // Usunięto: const [placeFilters, setPlaceFilters] = useState...

    // Filtrowanie parkingów
    useEffect(() => {
        if (parkings.length === 0 && searchTerm === '' && !vehicleFilters.car && !vehicleFilters.bus && !vehicleFilters.motorcycle) {
            setFilteredParkings([]); // Resetuj filtr, jeśli nie ma parkingów i brak aktywnych filtrów
            return;
        }

        let result = parkings;

        // Filtrowanie po nazwie parkingu
        if (searchTerm) {
            result = result.filter(parking =>
                parking.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrowanie po pojeździe
        if (vehicleFilters.car || vehicleFilters.bus || vehicleFilters.motorcycle) {
            result = result.filter(parking => {
                const placeGroups = parking.place_groups || [];
                return (
                    (vehicleFilters.car && placeGroups.some(g => g.type.toLowerCase() === 'samochód osobowy')) ||
                    (vehicleFilters.bus && placeGroups.some(g => g.type.toLowerCase() === 'autobus')) ||
                    (vehicleFilters.motorcycle && placeGroups.some(g => g.type.toLowerCase() === 'motocykl'))
                );
            });
        }

        setFilteredParkings(result);
    }, [searchTerm, vehicleFilters, parkings]); // Usunięto placeFilters z zależności

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
            setIsLoadingParkings(false);
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
            setIsLoadingParkings(true);
            setErrorParkings('');
            try {
                const parkingsData = await parkingsApi.getParkingsByParkId(parkId);
                setParkings(parkingsData);
                setFilteredParkings(parkingsData); // Początkowo ustaw wszystkie parkingi
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
                setIsLoadingParkings(false);
            }
        };

        fetchParkDetails();
        fetchParkings();
    }, [parkId]);

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
                                checked={vehicleFilters.motorcycle}
                                onChange={() => handleVehicleFilterChange('motorcycle')}
                            />
                            Motocykl
                        </label>
                    </div>
                </div>

                <div className={styles.parkingsSection}>
                    <h2>Parkingi {filteredParkings.length !== parkings.length && `(${filteredParkings.length}/${parkings.length})`}</h2>
                    {errorParkings && <p className={styles.error}>{errorParkings}</p>}
                    {!isLoadingParkings && filteredParkings.length === 0 && (
                        <p>Brak dostępnych parkingów spełniających kryteria.</p>
                    )}
                    {filteredParkings.length > 0 && (
                        <ul className={styles.parkingList}>
                            {filteredParkings.map((parking) => (
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
                                                    {parking.place_groups.map((group: PlaceGroup) => (
                                                        <li key={group.group_id} className={styles.placeGroupItem}>
                                                            <span className={styles.placeGroupType}>{group.type}:</span>
                                                            <span className={styles.placeGroupIcon}>
                                                                {group.quantity > 0 ? '🟢' : '🔴'}
                                                            </span>
                                                            <span className={styles.placeGroupQuantity}>
                                                                (Dostępnych: {group.quantity})
                                                            </span>
                                                        </li>
                                                    ))}
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
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div >
    );
};

export default ParkPage;