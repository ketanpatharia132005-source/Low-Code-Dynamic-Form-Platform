import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Builder.css";

function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  shareLink,
}) {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
        onCancel();
      }, 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>

        {message && <p>{message}</p>}

        {shareLink && (
          <div className="share-link-box">

            <p>
              {t(
                "builder.shareForm.publishedSuccessfully"
              )}
            </p>

            <input
              type="text"
              value={shareLink}
              readOnly
              className="share-link-input"
            />

            <button
              type="button"
              className="copy-btn"
              onClick={handleCopy}
            >
              {copied
                ? t("builder.shareForm.copied")
                : t("builder.shareForm.copyLink")}
            </button>

          </div>
        )}

        <div className="modal-actions">

          <button
            type="button"
            className="modal-btn-cancel"
            onClick={onCancel}
          >
            {shareLink
              ? t("builder.shareForm.close")
              : t("builder.shareForm.cancel")}
          </button>

          {!shareLink && confirmLabel && (
            <button
              type="button"
              className="modal-btn-confirm"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;