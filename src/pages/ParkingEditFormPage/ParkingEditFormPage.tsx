// src/pages/EditParkingPage/EditParkingPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parkingsApi } from '../../api/parkingsApi';
import { Parking } from '../../types/parkings'; // Importuj tylko Parking
import { PlaceGroup } from '../../types/placeGroup'; // Upewnij się, że Parking i PlaceGroup są importowane
import styles from './ParkingEditFormPage.module.scss';

const EditParkingPage: React.FC = () => {
    const { parkingId: paramParkingId } = useParams<{ parkingId: string }>(); // Zmieniamy nazwę, żeby uniknąć kolizji
    const navigate = useNavigate();

    // Upewniamy się, że parkingId jest liczbą
    const parsedParkingId = paramParkingId ? parseInt(paramParkingId, 10) : null;

    const [parking, setParking] = useState<Parking | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    // formData może być Parking (jeśli zawsze chcemy wysyłać pełen obiekt)
    // lub Partial<Parking> jeśli tylko zmienione pola
    const [formData, setFormData] = useState<Partial<Parking>>({});
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>('');
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

    useEffect(() => {
        const fetchParkingData = async () => {
            if (parsedParkingId === null || isNaN(parsedParkingId)) {
                setError('Nieprawidłowy ID parkingu.');
                setIsLoading(false);
                return;
            }
            try {
                // Używamy parsedParkingId jako liczby
                const fetchedParking = await parkingsApi.getById(parsedParkingId);
                setParking(fetchedParking);
                setFormData({
                    name: fetchedParking.name,
                    address: fetchedParking.address,
                    imageUrl: fetchedParking.imageUrl,
                    description: fetchedParking.description,
                    // Pamiętaj, aby skopiować place_groups głęboko, jeśli chcesz je modyfikować
                    place_groups: fetchedParking.place_groups ? fetchedParking.place_groups.map(pg => ({ ...pg })) : []
                });
            } catch (err: unknown) {
                console.error('Błąd podczas pobierania danych parkingu:', err);
                setError('Nie udało się pobrać danych parkingu.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchParkingData();
    }, [parsedParkingId]); // Zależność od parsedParkingId

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setSaveSuccess(false);
        setSaveError('');
    };

    const handlePlaceGroupChange = (index: number, field: keyof PlaceGroup, value: string | number) => {
        setFormData(prev => {
            const newPlaceGroups = [...(prev.place_groups || [])];
            if (newPlaceGroups[index]) {
                newPlaceGroups[index] = {
                    ...newPlaceGroups[index],
                    [field]: field === 'quantity' ? Number(value) : value
                };
            }
            return {
                ...prev,
                place_groups: newPlaceGroups
            };
        });
        setSaveSuccess(false);
        setSaveError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (parsedParkingId === null || isNaN(parsedParkingId)) {
            setSaveError('Nieprawidłowy ID parkingu do zapisu.');
            return;
        }

        setIsSaving(true);
        setSaveError('');
        setSaveSuccess(false);

        try {
            // Składamy pełny obiekt Parking do wysłania
            const dataToUpdate: Parking = {
                ...parking!, // Bierzemy aktualny obiekt parkingu (już wiemy, że nie jest null)
                ...formData, // Nadpisujemy zmienione pola z formularza
                parking_id: parsedParkingId // Upewnij się, że ID jest poprawne i typu number
            };

            // Wywołujemy parkingsApi.update z parsedParkingId (number) i pełnym obiektem Parking
            const updatedParking = await parkingsApi.update(parsedParkingId, dataToUpdate);
            setParking(updatedParking);
            setSaveSuccess(true);
            setTimeout(() => {
                navigate(`/owner-parkings`);
            }, 2000);
        } catch (err: unknown) {
            console.error('Błąd podczas aktualizacji danych parkingu:', err);
            let errorMessage = 'Nie udało się zaktualizować danych parkingu.';
            if (err instanceof Error) {
                errorMessage += ` Błąd: ${err.message}`;
            }
            setSaveError(errorMessage);
            setSaveSuccess(false);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Ładowanie danych parkingu...</p>
            </div>
        );
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!parking) {
        return <div className={styles.error}>Parking nie znaleziony.</div>;
    }

    return (
        <div className={styles.editParkingPageContainer}>
            <h1>Edytuj dane parkingu: {parking.name}</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nazwa parkingu:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="address">Adres:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="imageUrl">Link do zdjęcia:</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Opis:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={5}
                    ></textarea>
                </div>
                {/* Dodaj inne pola, które chcesz edytować, np. latitude, longitude, manager_id */}
                {/* <div className={styles.formGroup}>
                    <label htmlFor="latitude">Szerokość geograficzna:</label>
                    <input
                        type="number"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude ?? ''}
                        onChange={handleChange}
                        step="any"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="longitude">Długość geograficzna:</label>
                    <input
                        type="number"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude ?? ''}
                        onChange={handleChange}
                        step="any"
                    />
                </div> */}

                {/* Sekcja edycji grup miejsc */}
                {formData.place_groups && formData.place_groups.length > 0 && (
                    <div className={styles.placeGroupsSection}>
                        <h2>Dostępne miejsca:</h2>
                        {formData.place_groups.map((group, index) => (
                            <div key={group.group_id || `${group.type}-${index}`} className={styles.placeGroupItem}>
                                <label htmlFor={`quantity-${index}`}>{group.type} (ilość):</label>
                                <input
                                    type="number"
                                    id={`quantity-${index}`}
                                    value={group.quantity || 0}
                                    onChange={(e) => handlePlaceGroupChange(index, 'quantity', e.target.value)}
                                    min="0"
                                    required
                                />
                                {/* Możesz dodać więcej pól do edycji dla PlaceGroup, np. type */}
                            </div>
                        ))}
                    </div>
                )}

                {saveError && <p className={styles.error}>{saveError}</p>}
                {saveSuccess && <p className={styles.success}>Dane parkingu zostały pomyślnie zaktualizowane!</p>}

                <div className={styles.actions}>
                    <button type="submit" disabled={isSaving}>
                        {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                    </button>
                    <button type="button" onClick={() => navigate('/owner-parkings')} className={styles.cancelButton}>
                        Anuluj
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditParkingPage;