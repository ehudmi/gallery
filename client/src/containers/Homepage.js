import React, { useContext, useEffect } from "react";
import { AuthContext } from "../GlobalStates";
import isAuthenticated from "../Helpers/Authentication";

function Homepage() {
  const [authState, setAuthState] = useContext(AuthContext);
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <div>
      <p>Homepage</p>
      Welcome
      {authState.email}
    </div>
  );
}

export default Homepage;
