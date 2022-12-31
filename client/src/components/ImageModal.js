import ReactDOM from "react-dom";
import styles from "../styles/ImageModal.module.css";

const ImageModal = ({ show, closeModal, src }) =>
  show
    ? ReactDOM.createPortal(
        <>
          <div className={styles.modal_overlay} />
          <div className={styles.modal_wrapper}>
            <div className={styles.modal}>
              <h1 className={styles.modal_header}>Click again to close</h1>
              <img
                className={styles.image}
                onClick={closeModal}
                src={src}
                alt={"selected_image"}
              />
            </div>
          </div>
        </>,
        document.body
      )
    : null;

export default ImageModal;
