import { useEffect, useState } from "react";
// import useAuth from "../hooks/useAuth";

function UserComments() {
  // const { authState } = useAuth();

  const [comments, setComments] = useState([]);

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
      <section>
        <h1> User Comments</h1>
        {comments.map((item, index) => {
          return (
            <div key={index}>
              <p>{item.user_comment}</p>
              {
                <button onClick={() => deleteComment(item.comment_id)}>
                  Delete Comment
                </button>
              }
            </div>
          );
        })}
      </section>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default UserComments;
