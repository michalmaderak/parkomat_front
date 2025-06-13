import React, { useState, useRef } from 'react';
import styles from './ParkingFormPage.module.scss';

interface FormState {
  park: string;
  address: string;
  parkingName: string;
  car: number;
  motorcycle: number;
  bus: number;
}

const ParkingForm: React.FC = () => {
  const initialFormState: FormState = {
    park: '',
    address: '',
    parkingName: '',
    car: 0,
    motorcycle: 0,
    bus: 0,
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setFormState(initialFormState);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    console.log("Dane formularza:", formState);
    if (file) {
      console.log("Wybrany plik:", file.name, file.size, file.type);
    } else {
      console.log("Nie wybrano pliku.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Formularz dodawania nowego parkingu
      </div>

      <div className={styles.sectionTitle}>Dane podstawowe</div>
      <div className={styles.formGroup}>
        <label>Park Narodowy:</label>
        <div className={styles.inputWrapper}>
          <select name="park" value={formState.park} onChange={handleInputChange}>
            <option value="" disabled>Wybierz Park Narodowy...</option>
            <option>Tatrzański Park Narodowy</option>
            <option>Wigierski Park Narodowy</option>
            <option>Ojcowski Park Narodowy</option>
            <option>Pieniński Park Narodowy</option>
            <option>Poleski Park Narodowy</option>
            <option>Roztoczański Park Narodowy</option>
            <option>Wielkopolski Park Narodowy</option>
            <option>Karkonoski Park Narodowy</option>
            <option>Babiogórski Park Narodowy</option>
            <option>Gorczański Park Narodowy</option>
            <option>Magurski Park Narodowy</option>
            <option>Białowieski Park Narodowy</option>
            <option>Kampinoski Park Narodowy</option>
            <option>Biebrzański Park Narodowy</option>
            <option>Bieszczadzki Park Narodowy</option>
            <option>Park Narodowy Bory Tucholskie</option>
            <option>Narwiański Park Narodowy</option>
            <option>Park Narodowy Gór Stołowych</option>
            <option>Słowiński Park Narodowy</option>
            <option>Świętokrzyski Park Narodowy</option>
            <option>Park Narodowy Ujście Warty</option>
            <option>Drawieński Park Narodowy</option>
            <option>Woliński Park Narodowy</option>
          </select>
        </div>
      </div>

      {/* ZMODYFIKOWANE POLE ADRESU */}
      <div className={styles.formGroup}>
        <label>Adres:</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="address" // Dodany atrybut name
            value={formState.address} // Powiązane z nowym stanem
            onChange={handleInputChange} // Dodany handler zmiany
            // usunięto readOnly
          />
        </div>
      </div>
      {/* KONIEC ZMODYFIKOWANEGO POLA ADRESU */}

      <div className={styles.formGroup}>
        <label>Nazwa parkingu:</label>
        <input
          type="text"
          name="parkingName"
          value={formState.parkingName}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Prześlij zdjęcia:</label>
        <div className={styles.inputWrapper}>
          <input
            type="file"
            name="photos"
            onChange={handleInputChange}
            ref={fileInputRef}
          />
        </div>
      </div>

      <div className={styles.sectionTitle}>Ilość miejsc parkingowych</div>
      <div className={styles.formGroup}>
        <label>Samochód osobowy:</label>
        <input
          type="number"
          min="0"
          name="car"
          value={formState.car}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Motocykl:</label>
        <input
          type="number"
          min="0"
          name="motorcycle"
          value={formState.motorcycle}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Autobus:</label>
        <input
          type="number"
          min="0"
          name="bus"
          value={formState.bus}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.buttons}>
        <button className={styles.clear} onClick={handleReset}>
          Wyczyść formularz
        </button>
        <button className={styles.submit} onClick={handleSubmit}>
          Prześlij formularz
        </button>
      </div>
    </div>
  );
};

export default ParkingForm;