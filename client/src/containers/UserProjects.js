import React, { useContext, useEffect } from "react";
import { AuthContext } from "../GlobalStates";
import isAuthenticated from "../Helpers/Authentication";

function UserProjects() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>UserProjects</div>;
}

export default UserProjects;
