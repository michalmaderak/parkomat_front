// src/components/Navbar/Navbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { useAuth } from "../../context/AuthContext";
import logo from '../../assets/images/logo.png';
import logoutIcon from '../../assets/images/logoutIcon.png';
import loginIcon from '../../assets/images/loginIcon.png';
import registerIcon from '../../assets/images/registerIcon.png';
import parkingIcon from '../../assets/images/parkingIcon.png';
import cancelReservationIcon from '../../assets/images/cancelReservationIcon.png';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* --- Lewa Strona: Logo i Tytuł --- */}
      <Link to="/" className={styles.logoGroup}>
        <img src={logo} alt="Park-o-mat Logo" className={styles.logoImage} />
        <div className={styles.logoTextContainer}>
          <h1 className={styles.logoTitle}>PARK-O-MAT</h1>
          <p className={styles.logoSubtitle}>bliżej natury</p>
        </div>
      </Link>

      {/* --- Prawa Strona: Linki Autoryzacji --- */}
      <div className={styles.authLinks}>
        {isAuthenticated ? (
          // --- Zalogowany Użytkownik ---
          <>
            {/* Moje Parkingi */}
            <Link to="/owner/parkings" className={styles.authItem}>
              <img src={parkingIcon} alt="Moje Parkingi" className={styles.authIcon} />
              <span className={styles.authText}>Moje Parkingi</span>
            </Link>

            {/* Wyloguj (jako przycisk dla akcji) */}
            <button onClick={handleLogout} className={`${styles.authItem} ${styles.logoutButton}`}>
              <img src={logoutIcon} alt="Wyloguj" className={styles.authIcon} />
              <span className={styles.authText}>Wyloguj</span>
            </button>
          </>
        ) : (
          // --- Niezalogowany Użytkownik ---
          <>
          {/* Anulowanie rezerwacji */}
          <Link to="/cancelreservationpage" className={styles.authItem}>
              <span className={styles.authText}>Zmiana planów?</span>
              <img src={cancelReservationIcon} alt="Moje Parkingi" className={styles.authIcon} />
              <span className={styles.authText}>anuluj rezerwację</span>
            </Link>

            {/* SEPARATOR */}
            <div className={styles.separator}></div>
            
            {/* Logowanie */}
            <Link to="/login" className={styles.authItem}>
              <img src={loginIcon} alt="Logowanie" className={styles.authIcon} />
              <span className={styles.authText}>Logowanie</span>
            </Link>

            {/* Rejestracja */}
            <Link to="/register" className={styles.authItem}>
              <img src={registerIcon} alt="Rejestracja" className={styles.authIcon} />
              <span className={styles.authText}>Rejestracja</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;