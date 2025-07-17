// src/components/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/AdminLogin.module.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/admin/login", { email, password });
      const token = res.data.token;
      login(token); // ✅ Updates context
navigate("/admin/companylist"); // ✅ correct route now
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid credentials");
      } else if (err.response?.status === 404) {
        setError("Admin not found");
      } else {
        setError("Login failed. Try again.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          className={styles.input}
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default AdminLogin;
