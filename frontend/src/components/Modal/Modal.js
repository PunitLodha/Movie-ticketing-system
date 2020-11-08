import React from 'react';
import './modal.css';

const Modal = ({ show, onClose, children }) => {
  const onClosed = (event) => {
    onClose(event);
  };
  return (
    <>
      {show ? (
        <div class="modal" id="modal">
          <div class="content">{children}</div>
          <div class="actions">
            <button class="toggle-button" onClick={onClosed}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
