import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Comments.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import useAuth from "../hooks/useAuth";

function UserComments() {
  // const { authState } = useAuth();

  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const getUserComments = async () => {
    try {
      const response = await fetch("/users/user_comments", {
        method: "GET",
      });
      const json = await response.json();
      //   console.log(json);
      setComments(json);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (id) => {
    try {
      //   console.log(id);
      const response = await fetch("/users/delete_comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_id: id,
        }),
      });
      const json = await response.json();
      console.log(json);
      getUserComments();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(
    () => {
      getUserComments();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (comments.length > 0) {
    return (
      <div className={styles.commentsContainer}>
        <h1 className={styles.title}> My Comments</h1>
        {comments.map((item, index) => {
          return (
            <div className={styles.comment} key={index}>
              <p>
                {item.user_comment} - project
                <span
                  onClick={() => {
                    sessionStorage.setItem("project_id", item.project_id);
                    console.log(item.project_id);
                    return navigate("/project_details");
                  }}
                  className={styles.projectName}
                >
                  {" "}
                  {item.project_name}
                </span>
              </p>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={() => deleteComment(item.comment_id)}
                />
              }
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default UserComments;
