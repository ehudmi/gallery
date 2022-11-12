import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function UserProjects() {
  const { authState } = useAuth();
  const [projects, setProjects] = useState();
  const navigate = useNavigate();

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
    // props.loadData();
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
        <div>
          My Projects
          {projects.map((item, index) => {
            return <div key={index}>UserProjects {item.project_name}</div>;
          })}
        </div>
        <button onClick={() => navigate("/project_form")}>Add Project</button>
      </div>
    );
  } else {
    console.log(projects);
    return <div>Loading</div>;
  }
}

export default UserProjects;
