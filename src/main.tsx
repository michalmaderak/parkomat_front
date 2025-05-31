// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.scss'; // Import globalnych stylów
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- AuthProvider obejmuje resztę */}
      <App />
    </AuthProvider>
  </React.StrictMode>
)