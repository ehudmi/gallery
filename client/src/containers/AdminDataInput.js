import { useState } from "react";
import AddCourse from "../components/AddCourse";
import AddStudent from "../components/AddStudent";
import styles from "../styles/FormComponents.module.css";

function AdminDataInput() {
  const [typeAdd, setTypeAdd] = useState("");

  return (
    <>
      <section className={styles.FormContainer}>
        <form className={styles.ActiveForm}>
          <label htmlFor="student">student</label>
          <input
            type={"radio"}
            id="student"
            name="add_type"
            value={"student"}
            onChange={(e) => {
              setTypeAdd(e.target.value);
            }}
          />
          <label htmlFor="course">course</label>
          <input
            type={"radio"}
            id="course"
            name="add_type"
            value={"course"}
            onChange={(e) => {
              setTypeAdd(e.target.value);
            }}
          />
        </form>
      </section>

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
