import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.scss";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>
        <Link to="/">Park-o-mat</Link>
      </h1>
      <ul className={styles["nav-list"]}>
        <div className={`${styles["nav-container"]}`}>

        </div>
        <div className={`${styles["nav-container"]}`}>
          <li><Link to="/login">Logowanie</Link></li>
          <li><Link to="/register">Rejestracja</Link></li>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
