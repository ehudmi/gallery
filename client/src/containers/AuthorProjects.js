import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserProjects() {
  const [projects, setProjects] = useState();
  // const[images,setImages]=useState()
  const navigate = useNavigate();

  const getUserProjects = async () => {
    try {
      const response = await fetch("/projects/author_projects", {
        method: "GET",
      });
      const json = await response.json();
      // console.log(json);
      setProjects(json);
    } catch (error) {
      console.log(error);
    }
  };

  // const getProjectImages=async()=>{
  //   try {
  //     const response=await fetch()
  //   } catch (error) {

  //   }
  // }

  useEffect(() => {
    getUserProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (projects !== undefined) {
    console.log(projects);
    return (
      <div>
        <div>
          My Projects
          {/* {projects.map((item, index) => {
            return <div key={index}>UserProjects {item.project_name}</div>;
          })} */}
          {projects.map((item, index) => {
            return (
              <div key={index}>
                <p
                  onClick={
                    () => navigate("/project_details", { state: item })
                    // console.log(item)
                  }
                >
                  Project Name {item.project_name}
                </p>
              </div>
            );
          })}
        </div>
        <button onClick={() => navigate("/project_form")}>Add Project</button>
      </div>
    );
  } else {
    // console.log(projects);
    return <div>Loading</div>;
  }
}

export default UserProjects;
