import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ParkingEditFormPage.module.scss'; // Stwórz nowy plik SCSS
import { Parking } from '../../types/parkings'; // Upewnij się, że masz typ Parking

// Typ dla stanu formularza edycji
interface EditFormState {
    park: string;
    address: string;
    parkingName: string;
    description: string; // Dodajemy pole opisu
    car: number;
    motorcycle: number;
    bus: number;
    imageUrl: string | null; // Dodajemy pole na URL zdjęcia, jeśli jest
}

const ParkingEditFormPage: React.FC = () => {
    const { parkingId } = useParams<{ parkingId: string }>(); // Pobierz ID parkingu z URL
    const [formState, setFormState] = useState<EditFormState>({
        park: '',
        address: '',
        parkingName: '',
        description: '', // Domyślnie puste
        car: 0,
        motorcycle: 0,
        bus: 0,
        imageUrl: null,
    });
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Symulacja ładowania danych parkingu
    useEffect(() => {
        if (!parkingId) {
            setError("Brak ID parkingu do edycji.");
            setIsLoading(false);
            return;
        }

        const fetchParkingData = async () => {
            setIsLoading(true);
            setError('');
            setSuccessMessage('');
            try {
                // Tutaj normalnie byłoby wywołanie API do pobrania danych parkingu
                // const parkingData = await parkingsApi.getById(parkingId);
                // Symulujemy dane
                const simulatedParkingData: Parking = {
                    parking_id: parseInt(parkingId, 10),
                    name: `Parking nr ${parkingId}`,
                    address: `Ul. Przykładowa ${parkingId}, Kraków`,
                    description: `To jest opis parkingu numer ${parkingId}, idealny dla odwiedzających Park Narodowy.`,
                    imageUrl: parkingId === '1' ? 'https://via.placeholder.com/400x200?text=Parking+Image+1' : null,
                    latitude: 50.0614300,
                    longitude: 19.9365800,
                    place_groups: [
                        { group_id: 1, type: 'car', quantity: 50, parking_id: parseInt(parkingId, 10) },
                        { group_id: 2, type: 'motorcycle', quantity: 10, parking_id: parseInt(parkingId, 10) },
                        { group_id: 3, type: 'bus', quantity: 5, parking_id: parseInt(parkingId, 10) },
                    ],
                    park_id: 1, // Przykładowy park_id
                    manager_id: 1 // Przykładowy manager_id
                };

                // Uzupełnij formularz danymi z parkingu
                setFormState({
                    park: 'Tatrzański Park Narodowy', // Tutaj trzeba by mapować park_id na nazwę parku
                    address: simulatedParkingData.address || '',
                    parkingName: simulatedParkingData.name,
                    description: simulatedParkingData.description || '',
                    car: simulatedParkingData.place_groups?.find(pg => pg.type === 'car')?.quantity || 0,
                    motorcycle: simulatedParkingData.place_groups?.find(pg => pg.type === 'motorcycle')?.quantity || 0,
                    bus: simulatedParkingData.place_groups?.find(pg => pg.type === 'bus')?.quantity || 0,
                    imageUrl: simulatedParkingData.imageUrl || null,
                });
            } catch (err: unknown) {
                let errorMessage = "Nie udało się załadować danych parkingu do edycji.";
                if (err instanceof Error) {
                    errorMessage += ` Błąd: ${err.message}`;
                }
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchParkingData();
    }, [parkingId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (e.target.type === 'file') {
            const input = e.target as HTMLInputElement;
            setFile(input.files ? input.files[0] : null);
        } else if (e.target.type === 'number') {
            setFormState((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
        } else {
            setFormState((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleReset = () => {
        // W przypadku edycji, reset może przywrócić dane pierwotnie załadowane
        // LUB zresetować do stanu początkowego (jak w formularzu dodawania)
        // Na potrzeby edycji, lepiej załadować ponownie dane, lub mieć kopię pierwotnych danych
        // Tutaj po prostu zresetujemy do zera / pustych wartości, dla uproszczenia
        setFormState({
            park: '',
            address: '',
            parkingName: '',
            description: '',
            car: 0,
            motorcycle: 0,
            bus: 0,
            imageUrl: null,
        });
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setSuccessMessage('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Zapobiegaj domyślnej akcji formularza
        setSuccessMessage('');
        setError('');
        setIsLoading(true); // Ustawiamy loading na czas wysyłania

        try {
            // Tutaj byłoby wywołanie API do aktualizacji danych parkingu
            // Np. await parkingsApi.updateParking(parkingId, formState, file);
            console.log(`Zapisywanie zmian dla parkingu ID: ${parkingId}`);
            console.log("Nowe dane formularza:", formState);
            if (file) {
                console.log("Nowy plik do przesłania:", file.name, file.size, file.type);
            } else if (formState.imageUrl) {
                console.log("Istniejący URL obrazu:", formState.imageUrl);
            } else {
                console.log("Brak obrazu.");
            }

            // Symulujemy opóźnienie sieci
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccessMessage("Dane parkingu zostały pomyślnie zaktualizowane!");
            // Po sukcesie, możesz opcjonalnie zresetować pole pliku, jeśli chcesz, aby użytkownik musiał go ponownie wybrać
            // setFile(null);
            // if (fileInputRef.current) {
            //     fileInputRef.current.value = "";
            // }

        } catch (err: unknown) {
            let errorMessage = "Nie udało się zaktualizować danych parkingu.";
            if (err instanceof Error) {
                errorMessage += ` Błąd: ${err.message}`;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false); // Zakończ loading
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

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Edycja informacji o parkingu (ID: {parkingId})
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div className={styles.sectionTitle}>Dane podstawowe</div>
                <div className={styles.formGroup}>
                    <label htmlFor="park">Park Narodowy:</label>
                    <div className={styles.inputWrapper}>
                        <select
                            id="park"
                            name="park"
                            value={formState.park}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Wybierz Park Narodowy...</option>
                            <option value="Tatrzański Park Narodowy">Tatrzański Park Narodowy</option>
                            <option value="Wigierski Park Narodowy">Wigierski Park Narodowy</option>
                            <option value="Ojcowski Park Narodowy">Ojcowski Park Narodowy</option>
                            <option value="Pieniński Park Narodowy">Pieniński Park Narodowy</option>
                            <option value="Poleski Park Narodowy">Poleski Park Narodowy</option>
                            <option value="Roztoczański Park Narodowy">Roztoczański Park Narodowy</option>
                            <option value="Wielkopolski Park Narodowy">Wielkopolski Park Narodowy</option>
                            <option value="Karkonoski Park Narodowy">Karkonoski Park Narodowy</option>
                            <option value="Babiogórski Park Narodowy">Babiogórski Park Narodowy</option>
                            <option value="Gorczański Park Narodowy">Gorczański Park Narodowy</option>
                            <option value="Magurski Park Narodowy">Magurski Park Narodowy</option>
                            <option value="Białowieski Park Narodowy">Białowieski Park Narodowy</option>
                            <option value="Kampinoski Park Narodowy">Kampinoski Park Narodowy</option>
                            <option value="Biebrzański Park Narodowy">Biebrzański Park Narodowy</option>
                            <option value="Bieszczadzki Park Narodowy">Bieszczadzki Park Narodowy</option>
                            <option value="Park Narodowy Bory Tucholskie">Park Narodowy Bory Tucholskie</option>
                            <option value="Narwiański Park Narodowy">Narwiański Park Narodowy</option>
                            <option value="Park Narodowy Gór Stołowych">Park Narodowy Gór Stołowych</option>
                            <option value="Słowiński Park Narodowy">Słowiński Park Narodowy</option>
                            <option value="Świętokrzyski Park Narodowy">Świętokrzyski Park Narodowy</option>
                            <option value="Park Narodowy Ujście Warty">Park Narodowy Ujście Warty</option>
                            <option value="Drawieński Park Narodowy">Drawieński Park Narodowy</option>
                            <option value="Woliński Park Narodowy">Woliński Park Narodowy</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="address">Adres:</label>
                    <div className={styles.inputWrapper}>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            value={formState.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="parkingName">Nazwa parkingu:</label>
                    <input
                        id="parkingName"
                        type="text"
                        name="parkingName"
                        value={formState.parkingName}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Opis parkingu:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        rows={5}
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="photos">Prześlij nowe zdjęcie:</label>
                    <div className={styles.inputWrapper}>
                        <input
                            id="photos"
                            type="file"
                            name="photos"
                            accept="image/*"
                            onChange={handleInputChange}
                            ref={fileInputRef}
                        />
                    </div>
                    {formState.imageUrl && !file && ( // Pokaż istniejące zdjęcie, jeśli nie wybrano nowego
                        <div className={styles.currentImagePreview}>
                            <p>Aktualne zdjęcie:</p>
                            <img src={formState.imageUrl} alt="Aktualne zdjęcie parkingu" />
                        </div>
                    )}
                    {file && ( // Pokaż podgląd wybranego pliku
                        <div className={styles.currentImagePreview}>
                            <p>Wybrane nowe zdjęcie:</p>
                            <img src={URL.createObjectURL(file)} alt="Nowe zdjęcie parkingu" />
                        </div>
                    )}
                </div>

                <div className={styles.sectionTitle}>Ilość miejsc parkingowych</div>
                <div className={styles.formGroup}>
                    <label htmlFor="car">Samochód osobowy:</label>
                    <input
                        id="car"
                        type="number"
                        min="0"
                        name="car"
                        value={formState.car}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="motorcycle">Motocykl:</label>
                    <input
                        id="motorcycle"
                        type="number"
                        min="0"
                        name="motorcycle"
                        value={formState.motorcycle}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="bus">Autobus:</label>
                    <input
                        id="bus"
                        type="number"
                        min="0"
                        name="bus"
                        value={formState.bus}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.buttons}>
                    <button type="button" className={styles.clear} onClick={handleReset}>
                        Wyczyść formularz
                    </button>
                    <button type="submit" className={styles.submit} disabled={isLoading}>
                        {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ParkingEditFormPage;