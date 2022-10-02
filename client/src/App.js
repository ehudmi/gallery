import React, { useState } from "react";
import "./App.css";
import Modal from "./containers/Modal";
import AppRouter from "./AppRouter";

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
        onOkay={() => {
          setModalIsOpen(false);
        }}
        okayText={"Okay!"}
        //headerOverride={<div>Header</div>}
        //footerOverride={<div>Footer</div>}
      >
        <p>I'm a simple React component.</p>

        <p>
          Nesting content between the <code>Modal</code> tags will render it
          here. The content is accessible under the <code>children</code> prop.
        </p>
      </Modal>
      <AppRouter />
    </div>
  );
}

export default App;
