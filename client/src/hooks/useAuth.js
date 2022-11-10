import { useContext } from "react";
import AuthContext from "../context/GlobalStates";

const useAuth = () => {
  // const {authState}=useContext(AuthContext)
  return useContext(AuthContext);
};

export default useAuth;
