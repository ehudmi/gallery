import React, { useContext } from "react";
import { AuthContext } from "../GlobalStates";

function Homepage() {
  const [authState] = useContext(AuthContext);
  return (
    <div>
      <p>Homepage</p>
      Welcome
      {authState.email}
    </div>
  );
}

export default Homepage;
