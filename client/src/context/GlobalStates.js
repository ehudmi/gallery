import React, { useState, createContext } from "react";

// Global context state to be used by components and containers as needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    userId: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });
  return (
    <AuthContext.Provider value={[authState, setAuthState]}>
      {children}
    </AuthContext.Provider>
  );
};
