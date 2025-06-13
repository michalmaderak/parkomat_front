import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import styles from './LoginPage.module.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      const { token, userId } = response.data; 

      if (token && userId) {
        login(token, userId);
        toast.success('Zalogowano pomyślnie!');
        navigate('/');
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
    <div className={styles.container}>
      <h2 className={styles.title}>Logowanie</h2> 
      <form onSubmit={handleSubmit} className={styles.form}> 
        <div className={styles.formGroup}> 
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Zaloguj</button>
      </form>
    </div>
  );
};

export default LoginPage;