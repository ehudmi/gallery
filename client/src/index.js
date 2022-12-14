import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App.js";
import { AuthProvider } from "./context/GlobalStates";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
