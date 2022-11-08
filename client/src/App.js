import React, { useContext } from "react";
import { AuthContext } from "./context/GlobalStates";
import isAuthenticated from "./Helpers/Authentication";
import AppRouter from "./AppRouter";

function App() {
  const [authState, setAuthState] = useContext(AuthContext);

  // check authentication status and set context if authenticated to use with routes and protected routes

  const loadData = async () => {
    try {
      let userAuth = await isAuthenticated();
      console.log(await userAuth);
      if (userAuth.userId > 0) {
        setAuthState({
          ...authState,
          userId: userAuth.userId,
          first_name: userAuth.first_name,
          last_name: userAuth.last_name,
          email: userAuth.email,
          role: userAuth.role,
        });
      } else {
        setAuthState({ ...authState, message: "failed" });
        console.log(authState.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="App">
      <AppRouter loadData={loadData} />
    </main>
  );
}

export default App;
