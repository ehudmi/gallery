import useAuth from "./useAuth";

const useAccessToken = () => {
  const { setAuthState } = useAuth();

  // function to check authentication status in backend

  const isAuthenticated = async () => {
    try {
      const response = await fetch("/projects/auth", {
        method: "GET",
      });
      const userAuth = await response.json();
      if (userAuth.userId > 0) {
        setAuthState((prev) => {
          return {
            ...prev,
            userId: userAuth.userId,
            first_name: userAuth.first_name,
            last_name: userAuth.last_name,
            email: userAuth.email,
            role: userAuth.role,
          };
        });
      } else {
        setAuthState((prev) => {
          return { ...prev, message: "failed" };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return isAuthenticated;
};

export default useAccessToken;
