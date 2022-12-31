import { useState } from "react";
import AddCourse from "../components/AddCourse";
import AddStudent from "../components/AddStudent";
import styles from "../styles/Search.module.css";

function AdminDataInput() {
  const [typeAdd, setTypeAdd] = useState("");

  return (
    <>
      <div className={styles.bigDaddy}>
        <div className={styles.listContainer}>
          <h1 className={styles.listHeader}>Select data to add</h1>
          <div className={styles.btnContainer}>
            <label className={styles.lblSearch} htmlFor="student">
              <input
                className={styles.inpSearch}
                type={"radio"}
                id="student"
                name="add_type"
                value={"student"}
                onChange={(e) => {
                  setTypeAdd(e.target.value);
                }}
              />
              <span className={styles.lblSpan}>Student</span>
            </label>

            <label className={styles.lblSearch} htmlFor="course">
              <input
                className={styles.inpSearch}
                type={"radio"}
                id="course"
                name="add_type"
                value={"course"}
                onChange={(e) => {
                  setTypeAdd(e.target.value);
                }}
              />
              <span className={styles.lblSpan}>Course</span>
            </label>
          </div>
        </div>
      </div>

      {(() => {
        switch (typeAdd) {
          case "student":
            return <AddStudent />;
          case "course":
            return <AddCourse />;
          default:
            return null;
        }
      })()}
    </>
  );
}

export default AdminDataInput;
