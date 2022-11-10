import React, { useState, createContext } from "react";

// Global context state to be used by components and containers as needed

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({});
  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
