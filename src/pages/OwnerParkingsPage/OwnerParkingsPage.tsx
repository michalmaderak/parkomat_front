import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './OwnerParkingsPage.module.scss';
import { Parking } from '../../types/parkings';
import { PlaceGroup } from '../../types/placeGroup';
import { parkingsApi } from '../../api/parkingsApi'; 
import { useAuth } from '../../context/AuthContext';

const OwnerParkingsPage: React.FC = () => {
    const { userId } = useAuth(); 
    const [parkings, setParkings] = useState<Parking[]>([]);
    const [filteredParkings, setFilteredParkings] = useState<Parking[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

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

        setFilteredParkings(result);
    }, [searchTerm, parkings]);


    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Ładowanie Twoich parkingów...</p>
            </div>
        );
    }

    return (
        <div className={styles.ownerParkingsPageContainer}>
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

                <div className={styles.addParkingButtonContainer}>
                    <Link to="/owner/parkingAdd" className={styles.actionButton}>
                        <button>Dodaj nowy parking</button>
                    </Link>
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
                                            <Link to={`/owner/parkingEdit/${parking.parking_id}`} className={styles.actionButton}>
                                                <button>Edytuj</button>
                                            </Link>
                                            <Link to={`/parking/${parking.parking_id}`} className={styles.actionButton}>
                                                <button>Szczegóły</button>
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