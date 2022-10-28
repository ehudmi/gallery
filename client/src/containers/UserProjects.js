import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../GlobalStates";
import isAuthenticated from "../Helpers/Authentication";

function UserProjects() {
  const [authState, setAuthState] = useContext(AuthContext);
  const [projects, setProjects] = useState();

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

  const getUserProjects = async () => {
    try {
      const response = await fetch("/projects/user_projects", {
        method: "GET",
      });
      const json = await response.json();
      console.log(json);
      setProjects(json);
      // console.log(projects.hello);
      // return projects;
      // const userProjects = response.json();
      // return userProjects;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
    getUserProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (authState !== "") {
  //     getUserProjects();
  //     console.log(userProjects);
  //   } else {
  //     console.log("loading");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (authState !== "" && projects !== undefined) {
    // getUserProjects();
    // console.log(userProjects);
    console.log(projects);
    return (
      <div>
        My Projects
        {projects.map((item, index) => {
          return <div key={index}>UserProjects {item.project_name}</div>;
        })}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default UserProjects;
