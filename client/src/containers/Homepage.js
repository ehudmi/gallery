import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../GlobalStates";
import isAuthenticated from "../Helpers/Authentication";

function Homepage() {
  const navigate = useNavigate();
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

  return (
    <div>
      <p>Homepage</p>
      Welcome
      {authState.email}
      <button onClick={() => navigate("/my_projects")}>User Projects</button>
    </div>
  );
}

export default Homepage;
