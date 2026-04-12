import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null if not logged in

  const login = (email, password) => {
    // Dummy authentication
    if (email === "admin@rasanusantara.id" && password === "admin") {
      const adminData = { role: "admin", name: "Admin Utama", email };
      setUser(adminData);
      return adminData;
    } else if (email === "user@email.com" && password === "user") {
      const userData = { role: "user", name: "Pengguna Setia", email };
      setUser(userData);
      return userData;
    }
    return null; // indicates failed login
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
