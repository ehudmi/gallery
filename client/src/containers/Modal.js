import React from "react";

function Modal({
  children,
  isOpen,
  title,
  modalClass = "",
  // headerOverride,
  // footerOverride,
  onClose,
  onCancel,
  onOkay,
  cancelText = "Cancel",
  okayText = "Submit",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalContainer">
      <div className="overlay" onClick={onClose}></div>

      <div className={`modal ${modalClass}`}>
        <div className="header">
          {/* {headerOverride ? (
            <Fragment>{header}</Fragment>
          ) : ( */}
          <div className="titleBar">
            <div className="title">{title}</div>
            <div className="close" onClick={onClose}>
              X
            </div>
          </div>
          {/* )} */}
        </div>

        <div className="content">{children}</div>

        <div className="footer">
          {/* {footerOverride ? (
            <Fragment>{footer}</Fragment>
          ) : ( */}
          <div className="controls">
            {onCancel && <button onClick={onCancel}>{cancelText}</button>}
            {onOkay && <button onClick={onOkay}>{okayText}</button>}
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}

export default Modal;
