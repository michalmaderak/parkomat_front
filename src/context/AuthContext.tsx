// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  // Dodano userId/ownerId, który będzie przechowywał ID zalogowanego użytkownika/właściciela
  userId: string | null;
  login: (token: string, userId: string) => void; // Zmieniono sygnaturę funkcji login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); // Zmieniono domyślną wartość na undefined

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null); // Dodano stan dla userId

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId"); // Próbujemy pobrać userId z localStorage

    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    } else {
      // Jeśli token lub userId brakuje, upewniamy się, że stan jest czysty
      setIsAuthenticated(false);
      setUserId(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
    }
  }, []);

  // Zaktualizowana funkcja login, która przyjmuje token i userId
  const login = (token: string, newUserId: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userId", newUserId); // Zapisz userId w localStorage
    setIsAuthenticated(true);
    setUserId(newUserId);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId"); // Usuń userId przy wylogowaniu
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Wyrzuć błąd, jeśli useAuth jest użyte poza AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};