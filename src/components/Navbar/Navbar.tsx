// src/components/Navbar/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useAuth } from "../../context/AuthContext";
import logo from '../../assets/images/logo.png';
const Navbar: React.FC = () => {
  // Pobierz stan i funkcje z kontekstu AuthContext
  const { isAuthenticated, logout } = useAuth(); // Zakładam, że masz 'isAuthenticated' i 'logout'
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Wywołaj funkcję logout z kontekstu
    navigate("/login"); // Opcjonalnie: przekieruj na stronę logowania po wylogowaniu
    // lub navigate("/"); jeśli wolisz stronę główną
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoLink}> {/* Możesz dodać klasę dla linku z logo */}
        <img src={logo} alt="Park-o-mat Logo" className={styles.logoImage} /> {/* Użyj zaimportowanego logo */}
      </Link>
      <li>
      <h1 className={styles.logo}>
        <Link to="/">PARK-O-MAT</Link>
      </h1>
      <p className={styles.logoSub}> <Link to="/">bliżej natury</Link></p>
      </li>
      <ul className={styles["nav-list"]}>
        {/* Możesz tu dodać inne linki, które są zawsze widoczne */}
        <div className={`${styles["nav-container"]}`}>
          {/* Tutaj inne linki nawigacyjne np. Strona Główna, Kontakt */}
        </div>

        {/* Kontener na linki zależne od stanu logowania */}
        <div className={`${styles["nav-container"]}`}>
          {isAuthenticated ? (
            // --- Co pokazać, gdy użytkownik JEST zalogowany ---
            <>
              <li>
                {/* Link do "Moje Parkingi" - upewnij się, że ścieżka '/parkpage' jest poprawna */}
                <Link to="/parkpage">Moje Parkingi</Link>
              </li>
              <li>
                {/* Przycisk wylogowania */}
                <button onClick={handleLogout} className={styles.logoutButton /* Możesz dodać styl dla przycisku */}>
                  Wyloguj
                </button>
              </li>
            </>
          ) : (
            // --- Co pokazać, gdy użytkownik NIE JEST zalogowany ---
            <>
              <li>
                <Link to="/login">Logowanie</Link>
              </li>
              <li>
                <Link to="/register">Rejestracja</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;