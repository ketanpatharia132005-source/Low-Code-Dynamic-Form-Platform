import React from "react";
import "./Builder.css";

function ConfirmationModal({ isOpen, title, message, confirmLabel, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="modal-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="modal-btn-confirm" onClick={onConfirm}>
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;