import React, { useState } from "react";
import "./App.css";
import Modal from "./containers/Modal";
import AppRouter from "./AppRouter";

let regexPass = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,15}$");
sessionStorage.setItem("key", "value");

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleChangeEmail = (e) => {
    console.log(e.target);
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    if (e.target.value.match(regexPass) != null) {
      setPassword({ password: e.target.value });
    } else {
      alert(`1 Uppercase\n1 Lowercase\n1 Digit\n8-15 Characters`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userLogin = {
      email: email,
      password: password.password,
    };
    console.log(userLogin);
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLogin),
    });
    let userLoggedIn = await response.json();
    console.log(await userLoggedIn);
    if (userLoggedIn.userid > 0) {
      sessionStorage.setItem("userid", userLoggedIn.userid);
    } else {
      alert(userLoggedIn.msg);
    }
  };

  return (
    <div className="App">
      {!modalIsOpen && (
        <button onClick={() => setModalIsOpen(true)}>Open modal</button>
      )}
      <Modal
        isOpen={modalIsOpen}
        title="Hello"
        onClose={() => setModalIsOpen(false)}
        onCancel={() => {
          setModalIsOpen(false);
        }}
        onOkay={(e) => {
          console.log(e.target);
          setModalIsOpen(false);
        }}
        okayText={"Okay!"}
        //headerOverride={<div>Header</div>}
        //footerOverride={<div>Footer</div>}
      >
        <p>Login</p>
        <form>
          <input
            type={"email"}
            name="email"
            placeholder="Email"
            onChange={handleChangeEmail}
          />
          <br />
          <input
            type={"password"}
            name="password"
            placeholder="Password"
            onBlur={handleChangePassword}
          />
        </form>
      </Modal>
      <AppRouter />
    </div>
  );
}

export default App;
