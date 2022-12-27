import { useEffect, useState, useCallback } from "react";
import useAuth from "../hooks/useAuth";
import styles from "../styles/Comments.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useModal from "../hooks/useModal";
import ConfirmModal from "../components/ConfirmModal";

function ProjectComments({ project_id }) {
  const { authState } = useAuth();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const {
    isShowing,
    toggle,
    message,
    selectedId,
    setSelectedId,
    setType,
    type,
  } = useModal();

  // retrieve list of comments for current project

  const getProjectComments = useCallback(async () => {
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
      setComments(json);
    } catch (error) {
      console.log(error);
    }
  }, [project_id]);

  // delete comment from list of comments for current project

  const deleteComment = async (id) => {
    try {
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
      toggle();
      getProjectComments();
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async () => {
    try {
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
      const json = await response.json();
      console.log(json);
      getProjectComments();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjectComments();
  }, [getProjectComments]);

  if (comments.length > 0) {
    return (
      <div className={styles.commentsContainer}>
        <h1 className={styles.title}> Project Comments</h1>
        {comments.map((item, index) => {
          return (
            <div className={styles.comment} key={index}>
              <p>
                {item.user_comment} by{" "}
                <span>
                  {item.first_name} {item.last_name}
                </span>
              </p>
              <FontAwesomeIcon
                icon={faTimes}
                className={
                  authState.userId === item.user_id ? "invalid" : "hide"
                }
                onClick={() => {
                  setType("comment");
                  setSelectedId(item.comment_id);
                  toggle();
                }}
              />
            </div>
          );
        })}
        <div>
          <label htmlFor="new_comment">Add Comment</label>
          <textarea
            className={styles.textarea}
            id="new_comment"
            placeholder="New Comment"
            rows="4"
            cols="50"
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button className="btn" onClick={addComment}>
            Add Comment
          </button>
        </div>
        <ConfirmModal
          isShowing={isShowing}
          hide={toggle}
          message={message}
          confirmModal={deleteComment}
          id={selectedId}
          type={type}
        />
      </div>
    );
  } else {
    return (
      <div className={styles.commentsContainer}>
        <label htmlFor="new_comment">Add Comment</label>
        <textarea
          className={styles.textarea}
          id="new_comment"
          placeholder="New Comment"
          rows="4"
          cols="50"
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button className="btn" onClick={addComment}>
          Add Comment
        </button>
      </div>
    );
  }
}

export default ProjectComments;
