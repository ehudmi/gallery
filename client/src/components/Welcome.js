import { useNavigate } from "react-router-dom";
import styles from "../styles/Welcome.module.css";

function Welcome() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <button onClick={() => navigate("/signup")}>Signup</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}

export default Welcome;
