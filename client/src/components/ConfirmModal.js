import ReactDOM from "react-dom";
import styles from "../styles/ConfirmModal.module.css";

const ConfirmModal = ({ isShowing, hide, confirmModal, id, message, type }) =>
  isShowing
    ? ReactDOM.createPortal(
        <>
          <div className={styles.modal_overlay} />
          <div
            className={styles.modal_wrapper}
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className={styles.modal}>
              <div className={styles.modal_header}>
                <h2>Delete Confirmation</h2>
              </div>
              <div className={styles.modal_body}>
                {message} {type}?
              </div>
              <div className={styles.modal_footer}>
                <button
                  type="button"
                  className={styles.modal_close_button}
                  data-dismiss="modal"
                  aria-label="Cancel"
                  onClick={hide}
                >
                  <span aria-hidden="true">Cancel</span>
                </button>
                <button
                  type="button"
                  className={styles.modal_close_button}
                  data-dismiss="modal"
                  aria-label="Delete"
                  onClick={() => confirmModal(id)}
                >
                  <span aria-hidden="true">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )
    : null;

export default ConfirmModal;
