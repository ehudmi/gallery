import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

function Logout() {
  const { authState, setAuthState } = useAuth();

  const [loggedOut, setLoggedOut] = useState(false);

  const logout = async () => {
    const response = await fetch("/users/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const serverLogout = await response.json();
    console.log(serverLogout);
    if (serverLogout.msg === "logging you out") {
      sessionStorage.clear();
      setAuthState("");
      setLoggedOut(true);
    } else {
      alert("server not logged out");
    }
  };

  //   const checkLogout = async () => {
  //     const response = await fetch("/user_comments", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log(await response.json());
  //   };

  useEffect(
    () => {
      logout();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loggedOut === true && authState === "") {
    return (
      <>
        <p>You have been logged out</p>
        <p>Your auth state is {authState}</p>
        <p>Your session data is {sessionStorage.key(0)}</p>
        {/* <button onClick={checkLogout}>check logged out</button> */}
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
