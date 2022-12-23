import { useState, useEffect, useCallback } from "react";
import useAuth from "../hooks/useAuth";

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
      <>
        <p>You have been logged out</p>
        <p>Your auth state is {authState}</p>
        <p>Your session data is {sessionStorage.key(0)}</p>
        <span className="line">
          <a href="login">Sign In</a>
        </span>
      </>
    );
  } else {
    return <div>Failed to log you out</div>;
  }
}

export default Logout;
