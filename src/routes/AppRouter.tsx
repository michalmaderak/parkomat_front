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
import OwnerParkingsPage from "../pages/OwnerParkingsPage/OwnerParkingsPage";
import ParkingFormPage from "../pages/ParkingFormPage/ParkingFormPage";
import ParkingEditFormPage from "../pages/ParkingEditFormPage/ParkingEditFormPage";

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

          {/* Strona z listą parkingów dla zalogowanego właściciela */}
          <Route path="/owner/parkings" element={<OwnerParkingsPage />} />
          <Route path="/owner/parkingAdd" element={<ParkingFormPage />} />
          <Route path="/owner/parkingEdit/:parkingId" element={<ParkingEditFormPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;