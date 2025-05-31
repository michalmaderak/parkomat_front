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
import ParkingPage from "../pages/ParkingPage/ParkingPage";
import CancelReservationPage from "../pages/CancelReservationPage/CancelReservationPage";

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
          
          <Route path="/parkpage/:parkId" element={<ParkPage />} />
          <Route path="/cancelreservationpage" element={<CancelReservationPage />} />
          <Route path="/parking/:parkingId" element={<ParkingPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};
//<Route path="/parkpage" element={<ParkPage />} />
export default App;
