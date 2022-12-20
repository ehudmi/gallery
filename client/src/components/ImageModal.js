import React from "react";
// import "./ImageModal.css";

function ImageModal({ show, closeModal, src }) {
  return (
    <>
      <div className={show ? "modal" : "hide"}>
        <img
          onClick={closeModal}
          src={src}
          alt={"selected_image"}
          style={{
            border: "2px solid black",
            borderRadius: "5px",
            width: 400,
            height: "auto",
            zIndex: 999,
            position: "fixed",
            top: "10%",
            left: "10%",
          }}
        />
      </div>
    </>
  );
}

export default ImageModal;
