import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ListContainer.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AdminUsers() {
  const [users, setUsers] = useState();
  const countUsers = useRef(0);

  const navigate = useNavigate();

  // retrieve list of users to display

  const getUserList = async (limit, offset) => {
    try {
      const response = await fetch("/users/user_list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: limit,
          offset: offset,
        }),
      });
      const json = await response.json();
      // console.log(json);
      setUsers(json);
    } catch (error) {
      console.log(error);
    }
  };

  // delete user from db

  const deleteUser = async (id) => {
    try {
      //   console.log(id);
      const response = await fetch("/users/delete_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const json = await response.json();
      console.log(json);
      getUserList(3, 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserList(3, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (users !== undefined) {
    // console.log(users);
    return (
      <div className={styles.listContainer}>
        <h1 className={styles.listHeader}>List of users</h1>
        {users.map((item, index) => {
          return (
            <div key={index}>
              <h3
                className={styles.listItem}
                onClick={() => {
                  sessionStorage.setItem("admin_user_id", item.id);
                  return navigate("/user_comments");
                }}
              >
                User Name: {item.first_name} {item.last_name}
              </h3>
              {
                <FontAwesomeIcon
                  icon={faTimes}
                  className="invalid"
                  onClick={() => deleteUser(item.id)}
                />
              }
            </div>
          );
        })}
        <div className={styles.btnContainer}>
          <button
            className={`${styles.btn} ${styles.prevButton} ${
              countUsers.current <= 0 ? "btnHidden" : "btnVisible"
            }`}
            id="previous"
            name="previous"
            onClick={() => {
              countUsers.current = countUsers.current - 3;
              getUserList(3, countUsers.current);
            }}
          >
            Previous
          </button>
          <button
            className={`${styles.btn} ${styles.nextButton} ${
              users.length === 0 ? "btnHidden" : "btnVisible"
            }`}
            // visibility={users.length === 0 ? "visible" : "hidden"}
            id="next"
            name="next"
            onClick={() => {
              countUsers.current = countUsers.current + 3;
              getUserList(3, countUsers.current);
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
}

export default AdminUsers;
