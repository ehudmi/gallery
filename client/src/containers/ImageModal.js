import React from "react";
// import "./ImageModal.css";

function ImageModal({
  show,
  closeModal,
  findPrev,
  findNext,
  hasPrev,
  hasNext,
  src,
}) {
  // const handleKeyDown = (e) => {
  //   if (e.keyCode === 27) closeModal();
  //   if (e.keyCode === 37 && hasPrev) findPrev();
  //   if (e.keyCode === 39 && hasNext) findNext();
  // };

  // if (!src) {
  //   console.log("whut");
  //   return null;
  // }
  // return (
  //   <div>
  //     <div className="modal-overlay" onClick={closeModal}></div>
  //     <div className="modal">
  //       <div className="modal-body">
  //         <a
  //           href="#"
  //           className="modal-close"
  //           onClick={closeModal}
  //           onKeyDown={handleKeyDown}
  //         >
  //           &times;
  //         </a>
  //         {hasPrev && (
  //           <a
  //             href="#"
  //             className="modal-prev"
  //             onClick={findPrev}
  //             onKeyDown={handleKeyDown}
  //           >
  //             &lsaquo;
  //           </a>
  //         )}
  //         {hasNext && (
  //           <a
  //             href="#"
  //             className="modal-next"
  //             onClick={findNext}
  //             onKeyDown={handleKeyDown}
  //           >
  //             &rsaquo;
  //           </a>
  //         )}
  //         <img src={src} />
  //       </div>
  //     </div>
  //   </div>
  // );

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
