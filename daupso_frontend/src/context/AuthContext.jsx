import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  const login = (id, adminFlag) => {
    setUserId(id);
    setIsAdmin(adminFlag);

    localStorage.setItem("userId", id);
    localStorage.setItem("isAdmin", adminFlag);
  };

  const logout = () => {
    setUserId(null);
    setIsAdmin(false);

    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ userId, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
