import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import styles from "./RegisterPage.module.scss";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    nip: "",
    accountNumber: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Imię jest wymagane.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Nazwisko jest wymagane.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email jest wymagany.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Nieprawidłowy format email.";
    }

    if (!formData.password) {
      newErrors.password = "Hasło jest wymagane.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Hasło musi mieć co najmniej 8 znaków.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Powtórzenie hasła jest wymagane.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hasła muszą być identyczne.";
    }

    if (!formData.phone) {
      newErrors.phone = "Numer telefonu jest wymagany.";
    }

    if (!formData.nip) {
      newErrors.nip = "NIP jest wymagany.";
    } else if (!/^\d{10}$/.test(formData.nip)) {
      newErrors.nip = "NIP musi składać się z 10 cyfr.";
    }

    if (!formData.accountNumber) {
      newErrors.accountNumber = "Numer konta jest wymagany.";
    } else if (!/^\d{26}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Numer konta musi składać się z 26 cyfr.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      await authApi.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        nip: formData.nip,
        accountNumber: formData.accountNumber
      });
      alert("Rejestracja udana. Możesz się teraz zalogować.");
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrors(
          error.response.data.errors || {
            general: "Błąd rejestracji. Spróbuj ponownie."
          }
        );
      } else {
        setErrors({ general: "Błąd rejestracji. Spróbuj ponownie." });
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Imię *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.firstName && <ErrorMessage message={errors.firstName} />}
        </div>

        <div className={styles.formGroup}>
          <label>Nazwisko *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.lastName && <ErrorMessage message={errors.lastName} />}
        </div>

        <div className={styles.formGroup}>
          <label>E-mail *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>

        <div className={styles.formGroup}>
          <label>Hasło *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.password && <ErrorMessage message={errors.password} />}
        </div>

        <div className={styles.formGroup}>
          <label>Powtórz hasło *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.confirmPassword && (
            <ErrorMessage message={errors.confirmPassword} />
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Nr. telefonu *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.phone && <ErrorMessage message={errors.phone} />}
        </div>

        <div className={styles.formGroup}>
          <label>NIP *</label>
          <input
            type="text"
            name="nip"
            value={formData.nip}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.nip && <ErrorMessage message={errors.nip} />}
        </div>

        <div className={styles.formGroup}>
          <label>Nr. konta *</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.accountNumber && (
            <ErrorMessage message={errors.accountNumber} />
          )}
        </div>

        {errors.general && <ErrorMessage message={errors.general} />}
        <button type="submit" className={styles.button}>
          Zarejestruj się
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;