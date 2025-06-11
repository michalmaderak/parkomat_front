import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TestApiComponent from "../components/TestApiComponent";
import Navbar from "../components/Navbar/Navbar";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../components/HomePage/HomePage";
import ParkPage from "../pages/ParkPage/ParkPage";
import ParkingDetailsPage from "../pages/ParkingPage/ParkingDetailsPage";
import CancelReservationPage from "../pages/CancelReservationPage/CancelReservationPage";
// --- NOWE IMPORTY ---
import OwnerParkingsPage from "../pages/OwnerParkingsPage/OwnerParkingsPage";
import ParkingFormPage from "../pages/ParkingFormPage/ParkingFormPage";
import ParkingEditFormPage from "../pages/ParkingEditFormPage/ParkingEditFormPage";
//import AddEditParkingPage from "../pages/AddEditParkingPage/AddEditParkingPage"; // Będziemy potrzebować komponentu do dodawania/edycji
// import OwnerParkingDetailsPage from "../pages/OwnerParkingDetailsPage/OwnerParkingDetailsPage"; // Opcjonalnie, jeśli chcesz inną stronę szczegółów dla właściciela
// --- KONIEC NOWYCH IMPORTÓW ---

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestApiComponent />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Trasy dla klientów */}
          <Route path="/parkpage/:parkId" element={<ParkPage />} />
          <Route path="/cancelreservationpage" element={<CancelReservationPage />} />
          <Route path="/parking/:parkingId" element={<ParkingDetailsPage />} />

          {/* --- NOWE TRASY DLA WŁAŚCICIELI --- */}
          {/* Strona z listą parkingów dla zalogowanego właściciela */}
          <Route path="/owner/parkings" element={<OwnerParkingsPage />} />
          <Route path="/owner/parkingAdd" element={<ParkingFormPage />} />
          <Route path="/owner/parkingEdit/:parkingId" element={<ParkingEditFormPage />} />


          {/* Strona do dodawania nowego parkingu */}
          {/* Zakładam, że AddEditParkingPage będzie służyć zarówno do dodawania, jak i edycji */}
          {/* <Route path="/owner/parking/add" element={<AddEditParkingPage />} />

          {/* Strona do edycji istniejącego parkingu */}
          {/* <Route path="/owner/parking/:parkingId/edit" element={<AddEditParkingPage />} /> */} */

          {/* Opcjonalnie: Strona szczegółów parkingu dla właściciela, jeśli różni się od ParkingDetailsPage dla klienta */}
          {/* Jeśli OwnerParkingDetailsPage jest taka sama jak ParkingDetailsPage, możesz użyć ParkingDetailsPage */}
          {/* <Route path="/owner/parking/:parkingId" element={<OwnerParkingDetailsPage />} /> */}
          {/* Albo po prostu przekierować do ParkingDetailsPage, jeśli funkcjonalność jest taka sama, ale zmieniasz logikę przycisków na podstawie roli użytkownika */}
          {/* <Route path="/owner/parking/:parkingId" element={<ParkingDetailsPage isOwnerView={true} />} /> */}
          {/* --- KONIEC NOWYCH TRAS DLA WŁAŚCICIELI --- */}
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;