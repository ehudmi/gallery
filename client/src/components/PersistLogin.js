import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAccessToken from "../hooks/useAccessToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useAccessToken();
  // const { authState, persist } = useAuth();
  const { authState } = useAuth();

  useEffect(() => {
    // let isMounted = true;

    const verifyAccessToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        // isMounted && setIsLoading(false);
        setIsLoading(false);
      }
    };

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    // !authState?.userId && persist ? verifyAccessToken() : setIsLoading(false);
    !authState?.userId ? verifyAccessToken() : setIsLoading(false);

    // return () => isMounted = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(authState?.userId)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      {/* {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            } */}
      {isLoading ? <p>Loading...</p> : <Outlet />}
    </>
  );
};

export default PersistLogin;
