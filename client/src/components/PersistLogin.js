import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAccessToken from "../hooks/useAccessToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useAccessToken();
  const { authState } = useAuth();

  useEffect(() => {
    const verifyAccessToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    !authState?.userId ? verifyAccessToken() : setIsLoading(false);
  }, [authState?.userId, refresh]);

  return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
