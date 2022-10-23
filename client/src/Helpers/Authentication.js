const isAuthenticated = async () => {
  try {
    const response = await fetch("/users/auth", {
      method: "GET",
    });
    const userAuth = response.json();
    return userAuth;
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;
