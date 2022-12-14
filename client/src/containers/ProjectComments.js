import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import styles from "../styles/Comments.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProjectComments({ project_id }) {
  const { authState } = useAuth();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // retrieve list of comments for current project

  const getProjectComments = async () => {
    try {
      const response = await fetch("/projects/project_comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: project_id,
        }),
      });
      const json = await response.json();
      //   console.log(json);
      setComments(json);
    } catch (error) {
      console.log(error);
    }
  };

  // delete comment from list of comments for current project

  const deleteComment = async (id) => {
    try {
      console.log(id);
      const response = await fetch("/projects/delete_comment", {
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
      getProjectComments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const response = await fetch("/projects/add_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: authState.userId,
        project_id: project_id,
        user_comment: newComment,
      }),
    });
    const commentAdd = await response.json();
    console.log(commentAdd);
  };

  useEffect(
    () => {
      getProjectComments();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (comments.length > 0) {
    return (
      <div className={styles.commentsContainer}>
        <h1 className={styles.title}> Project Comments</h1>
        {comments.map((item, index) => {
          return (
            <div className={styles.comment} key={index}>
              <p>
                {item.user_comment} by {item.first_name} {item.last_name}
              </p>
              {/* {authState.userId === item.user_id ? (
                <button onClick={() => deleteComment(item.comment_id)}>
                  Delete Comment
                </button>
              ) : null} */}
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  authState.userId === item.user_id ? "invalid" : "hide"
                }
                onClick={() => deleteComment(item.comment_id)}
              />
            </div>
          );
        })}
        <form>
          <h1>My Comment</h1>
          <textarea
            id="new_comment"
            placeholder="New Comment"
            rows="4"
            cols="50"
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button onClick={handleSubmit}>Submit New Comment</button>
        </form>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default ProjectComments;
