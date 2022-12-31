import { useState, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import styles from "../styles/FormComponents.module.css";

function Logout() {
  const { authState, setAuthState } = useAuth();

  const [loggedOut, setLoggedOut] = useState(false);

  const logout = useCallback(async () => {
    const response = await fetch("/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const serverLogout = await response.json();
    if (serverLogout.msg === "logging you out") {
      sessionStorage.clear();
      setAuthState("");
      setLoggedOut(true);
    } else {
      alert("server not logged out");
    }
  }, [setAuthState]);

  useEffect(() => {
    logout();
  }, [logout]);

  if (loggedOut === true && authState === "") {
    return (
      <div className={styles.logoutContainer}>
        <h1>You have been logged out</h1>
        <span className={styles.line}>
          <a href="login">Sign In</a>
        </span>
      </div>
    );
  } else {
    return <div>Failed to log you out</div>;
  }
}

export default Logout;
