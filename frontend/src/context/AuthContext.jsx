'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
        return data.data;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: 'user' })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem("user", JSON.stringify(data.data));
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message || 'Registrasi gagal' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Terjadi kesalahan server' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`
        },
        body: JSON.stringify(profileData)
      });
      const data = await response.json();
      if (data.success) {
        // Merge new data with existing user data (keep old token if new not provided)
        const updated = { ...storedUser, ...data.data };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        return { success: true };
      }
      return { success: false, message: data.message || 'Gagal memperbarui profil.' };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Terjadi kesalahan server.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
