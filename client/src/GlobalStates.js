import React, { useState, createContext } from "react";

// Global context state to be used by components and containers as needed

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [authState, setAuthState] = useState({
    userId: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });
  return (
    <AuthContext.Provider value={[authState, setAuthState]}>
      {props.children}
    </AuthContext.Provider>
  );
};
