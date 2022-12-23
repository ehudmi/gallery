import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Comments.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../hooks/useAuth";
import useModal from "../hooks/useModal";
import ConfirmModal from "../components/ConfirmModal";

function UserComments() {
  const { authState } = useAuth();
  const {
    isShowing,
    toggle,
    message,
    selectedId,
    setSelectedId,
    setType,
    type,
  } = useModal();

  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  // retrieve list of comments for current user

  const getUserComments = async (id) => {
    try {
      const response = await fetch("/users/user_comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const json = await response.json();
      setComments(json);
    } catch (error) {
      console.log(error);
    }
  };

  // delete comment from list of comments for current user

  const deleteComment = async (id) => {
    try {
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
      toggle();
      if (authState.role === "admin") {
        getUserComments(sessionStorage.getItem("admin_user_id"));
      } else {
        getUserComments(authState.userId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (authState.role === "admin") {
      getUserComments(sessionStorage.getItem("admin_user_id"));
    } else {
      getUserComments(authState.userId);
    }
  }, [authState.role, authState.userId]);

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
                    return navigate("/project_details");
                  }}
                  className={styles.projectName}
                >
                  {item.project_name}
                </span>
              </p>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  className="invalid"
                  onClick={() => {
                    setType("comment");
                    setSelectedId(item.comment_id);
                    toggle();
                  }}
                />
              }
            </div>
          );
        })}
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
    return <h3>You have no comments yet</h3>;
  }
}

export default UserComments;
