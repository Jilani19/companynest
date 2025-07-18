import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("adminToken") || null,
    isLoggedIn: !!localStorage.getItem("adminToken"),
  });

  const login = (token) => {
    localStorage.setItem("adminToken", token);
    setAuth({ token, isLoggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAuth({ token: null, isLoggedIn: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
