// src/pages/OwnerParkingsPage/OwnerParkingsPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './OwnerParkingsPage.module.scss'; // Stwórz nowy plik SCSS
import { Parking } from '../../types/parkings';
import { PlaceGroup } from '../../types/placeGroup';
import { parkingsApi } from '../../api/parkingsApi'; // Upewnij się, że masz tę ścieżkę do API
import { useAuth } from '../../context/AuthContext'; // Załóżmy, że masz kontekst uwierzytelniania do pobierania ID właściciela

const OwnerParkingsPage: React.FC = () => {
    const { userId } = useAuth(); // Przykład pobierania ID właściciela z kontekstu
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [vehicleFilters, setVehicleFilters] = useState({
        car: false,
        bus: false,
        motorcycle: false
    });
    const [placeFilters, setPlaceFilters] = useState({
        covered: false,
        uncovered: false
    });

    // Efekt do pobierania parkingów dla właściciela
    useEffect(() => {
        if (!userId) {
            setError("Brak ID właściciela. Upewnij się, że jesteś zalogowany.");
            setIsLoading(false);
            return;
        }

        const fetchOwnerParkings = async () => {
            setIsLoading(true);
            setError('');
            try {
                // Załóżmy, że parkingsApi ma metodę getParkingsByuserId
                const parkingsData = await parkingsApi.getParkingsByManagerId(userId);
                setParkings(parkingsData);
                setFilteredParkings(parkingsData); // Początkowo wyświetl wszystkie
            } catch (err: unknown) {
                console.error("Błąd podczas pobierania parkingów dla właściciela:", err);
                let errorMessage = "Nie udało się pobrać listy parkingów dla właściciela.";
                if (err instanceof Error) {
                    errorMessage += ` Błąd: ${err.message}`;
                }
                setError(errorMessage);
                setParkings([]);
                setFilteredParkings([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOwnerParkings();
    }, [userId]);

    // Efekt do filtrowania i wyszukiwania parkingów
    useEffect(() => {
        let result = parkings;

        // Wyszukiwanie po nazwie parkingu
        if (searchTerm) {
            result = result.filter(parking =>
                parking.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrowanie po typie pojazdu
        if (vehicleFilters.car || vehicleFilters.bus || vehicleFilters.motorcycle) {
            result = result.filter(parking => {
                const placeGroups = parking.place_groups || [];
                return (
                    (vehicleFilters.car && placeGroups.some(g => g.type.toLowerCase() === 'car')) ||
                    (vehicleFilters.bus && placeGroups.some(g => g.type.toLowerCase() === 'bus')) ||
                    (vehicleFilters.motorcycle && placeGroups.some(g => g.type.toLowerCase() === 'motorcycle'))
                );
            });
        }

        // Filtrowanie po typie miejsca (zadaszone/niezadaszone)
        if (placeFilters.covered || placeFilters.uncovered) {
            result = result.filter(parking => {
                const placeGroups = parking.place_groups || [];
                return (
                    (placeFilters.covered && placeGroups.some(g => g.type.toLowerCase().includes('covered'))) ||
                    (placeFilters.uncovered && placeGroups.some(g => g.type.toLowerCase().includes('uncovered')))
                );
            });
        }

        setFilteredParkings(result);
    }, [searchTerm, vehicleFilters, placeFilters, parkings]);

    const handleVehicleFilterChange = (type: keyof typeof vehicleFilters) => {
        setVehicleFilters(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handlePlaceFilterChange = (type: keyof typeof placeFilters) => {
        setPlaceFilters(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    if (isLoading) {
        return <p>Ładowanie Twoich parkingów...</p>;
    }

    return (
        <div className={styles.ownerParkingsPageContainer}>
            <h1>Moje Parkingi</h1>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.grid}>
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Szukaj parkingu po nazwie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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

                    <div className={styles.filterGroup}>
                        <p className={styles.filterTitle}>Typ miejsca:</p>
                        <label>
                            <input
                                type="checkbox"
                                checked={placeFilters.uncovered}
                                onChange={() => handlePlaceFilterChange('uncovered')}
                            />
                            Bez dachu
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={placeFilters.covered}
                                onChange={() => handlePlaceFilterChange('covered')}
                            />
                            Zadaszony
                        </label>
                    </div>
                </div>

                <div className={styles.parkingsSection}>
                    <h2>Twoje Parkingi {filteredParkings.length !== parkings.length && `(${filteredParkings.length}/${parkings.length})`}</h2>
                    {!isLoading && filteredParkings.length === 0 && (
                        <p>Brak dostępnych parkingów spełniających kryteria lub jeszcze nie dodałeś żadnych parkingów.</p>
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
                                            {/* Tutaj możesz dodać przyciski do edycji/usuwania/przeglądania szczegółów parkingu */}
                                            <Link to={`/owner/parking/${parking.parking_id}/edit`} className={styles.actionButton}>
                                                <button>Edytuj</button>
                                            </Link>
                                            <Link to={`/owner/parking/${parking.parking_id}/details`} className={styles.actionButton}>
                                                <button>Szczegóły</button>
                                            </Link>
                                            {/* Przycisk do dodawania nowego parkingu */}
                                            <Link to="/owner/parking/add" className={styles.actionButton}>
                                                <button>Dodaj nowy parking</button>
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

export default OwnerParkingsPage;