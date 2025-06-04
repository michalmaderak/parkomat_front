// src/pages/LoginPage/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Upewnij się, że ścieżka jest poprawna
import axiosClient from '../../api/axiosClient'; // Zakładam, że używasz axiosClient do zapytań
import { toast } from 'react-toastify'; // Jeśli używasz react-toastify

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth(); // Destrukturyzuj tylko funkcję login
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Zakładam, że Twój endpoint logowania zwraca token ORAZ userId
      // Przykładowa odpowiedź z backendu: { token: '...', userId: '...' }
      const response = await axiosClient.post('/auth/login', { email, password }); // Dostosuj endpoint do swojego backendu
      const { token, userId } = response.data; // <<--- KLUCZOWA ZMIANA: Destrukturyzujemy zarówno token jak i userId

      if (token && userId) {
        login(token, userId); // <<--- TUTAJ PRZEKAZUJEMY OBA ARGUMENTY
        toast.success('Zalogowano pomyślnie!');
        navigate('/'); // Przekieruj na stronę główną lub inną po zalogowaniu
      } else {
        toast.error('Błąd logowania: Brak tokenu lub ID użytkownika w odpowiedzi.');
      }
    } catch (error: any) {
      console.error('Błąd logowania:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Błąd logowania: ${error.response.data.message}`);
      } else {
        toast.error('Wystąpił nieznany błąd podczas logowania.');
      }
    }
  };

  return (
    <div className="login-page">
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginPage;