import React from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export function renderField(
  field,
  value = "",
  onChange = () => {},
  showLabel = true,
  error = null,
  setFieldErrors = () => {},
  t = null
) {
  if (!field) return null;

  const translate =
    typeof t === "function" ? t : (key, options) => {
      const defaults = {
        "builder.fieldRenderer.enterText": "Enter text...",
        "builder.fieldRenderer.enterNumber": "Enter number...",
        "builder.fieldRenderer.enterEmail": "Enter email address...",
        "builder.fieldRenderer.select": "Select...",
        "builder.fieldRenderer.enterResponse": "Enter your response...",
        "builder.fieldRenderer.untitledQuestion": "Untitled Question",
        "builder.fieldRenderer.invalidFileType":
          "Invalid file type. Allowed: {{allowed}}",
        "builder.fieldRenderer.fileSizeExceeded":
          "File size must not exceed {{maxSizeMB}} MB.",
        "builder.fieldRenderer.fileUploadFailed":
          "File upload failed. Please try again.",
      };

      let text = defaults[key] || key;

      if (options) {
        Object.entries(options).forEach(
          ([name, replacement]) => {
            text = text.replace(
              `{{${name}}}`,
              replacement
            );
          }
        );
      }

      return text;
    };

  const fieldType =
    field.field_type || field.type || "text";

  const labelText =
    field.label ||
    field.field_label ||
    field.title ||
    "";

  let parsedConfig = {};

  if (field.config) {
    if (typeof field.config === "string") {
      try {
        parsedConfig = JSON.parse(field.config);
      } catch (e) {
        console.error(
          "Could not parse field.config JSON string:",
          e
        );
      }
    } else {
      parsedConfig = field.config;
    }
  }

  const isRequired =
    field.required === true ||
    field.is_required === true ||
    parsedConfig.required === true;

  const placeholderText =
    parsedConfig.placeholder ||
    field.placeholder ||
    field.placeholder_text ||
    "";

  let rawOptions =
    parsedConfig.options ||
    field.options ||
    field.field_options ||
    [];

  let optionsArray = [];

  if (rawOptions) {
    if (typeof rawOptions === "string") {
      try {
        if (rawOptions.trim().startsWith("[")) {
          optionsArray = JSON.parse(rawOptions);
        } else {
          optionsArray = rawOptions
            .split(",")
            .map((opt) => opt.trim());
        }
      } catch (e) {
        optionsArray = rawOptions
          .split(",")
          .map((opt) => opt.trim());
      }
    } else if (Array.isArray(rawOptions)) {
      optionsArray = rawOptions;
    }
  }

  const renderInputElements = () => {
    switch (fieldType) {
      case "text":
        return (
          <input
            type="text"
            className="form-input"
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={
              placeholderText ||
              translate(
                "builder.fieldRenderer.enterText"
              )
            }
            maxLength={
              parsedConfig.max_length || undefined
            }
            required={isRequired}
            style={{
              border: error
                ? "1px solid #dc2626"
                : undefined,
            }}
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="form-input"
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={
              placeholderText ||
              translate(
                "builder.fieldRenderer.enterNumber"
              )
            }
            min={parsedConfig.min ?? undefined}
            max={parsedConfig.max ?? undefined}
            step={
              parsedConfig.integer_only
                ? 1
                : "any"
            }
            required={isRequired}
          />
        );

      case "email":
        return (
          <input
            type="email"
            className="form-input"
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={
              placeholderText ||
              translate(
                "builder.fieldRenderer.enterEmail"
              )
            }
            required={isRequired}
            style={{
              border: error
                ? "1px solid #dc2626"
                : undefined,
            }}
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="form-input"
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            min={
              parsedConfig.min_date || undefined
            }
            max={
              parsedConfig.max_date || undefined
            }
            required={isRequired}
          />
        );

      case "dropdown":
        return (
          <select
            className="form-select"
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            required={isRequired}
          >
            <option value="" disabled>
              {translate(
                "builder.fieldRenderer.select"
              )}
            </option>

            {optionsArray.map((opt) => {
              const optionValue =
                typeof opt === "object"
                  ? opt.value || opt.label
                  : opt;

              const optionLabel =
                typeof opt === "object"
                  ? opt.label
                  : opt;

              return (
                <option
                  key={optionValue}
                  value={optionValue}
                >
                  {optionLabel}
                </option>
              );
            })}
          </select>
        );

      case "checkbox": {
        const currentChecked = Array.isArray(value)
          ? value
          : [];

        const handleCheckboxChange = (optValue) => {
          if (
            currentChecked.includes(optValue)
          ) {
            onChange(
              currentChecked.filter(
                (item) => item !== optValue
              )
            );
          } else {
            onChange([
              ...currentChecked,
              optValue,
            ]);
          }
        };

        return (
          <div
            className="checkbox-group"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "4px",
              border: error
                ? "1px solid #dc2626"
                : "1px solid transparent",
              borderRadius: "6px",
              padding: "8px",
            }}
          >
            {optionsArray.map((opt) => {
              const optionValue =
                typeof opt === "object"
                  ? opt.value || opt.label
                  : opt;

              const optionLabel =
                typeof opt === "object"
                  ? opt.label
                  : opt;

              return (
                <label
                  key={optionValue}
                  className="checkbox-option"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={currentChecked.includes(
                      optionValue
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        optionValue
                      )
                    }
                  />

                  <span
                    style={{
                      color: error
                        ? "#dc2626"
                        : "var(--text-main)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {optionLabel}
                  </span>
                </label>
              );
            })}
          </div>
        );
      }

      case "file":
        return (
          <input
            type="file"
            className="form-input"
            accept={
              Array.isArray(
                parsedConfig.allowed_types
              ) &&
              parsedConfig.allowed_types.length > 0
                ? parsedConfig.allowed_types.join(",")
                : undefined
            }
            onChange={async (e) => {
              const file = e.target.files[0];

              if (!file) return;

              if (
                Array.isArray(
                  parsedConfig.allowed_types
                ) &&
                parsedConfig.allowed_types.length > 0
              ) {
                const extension =
                  "." +
                  file.name
                    .split(".")
                    .pop()
                    .toLowerCase();

                const allowed =
                  parsedConfig.allowed_types.map(
                    (type) =>
                      type.toLowerCase()
                  );

                if (
                  !allowed.includes(extension)
                ) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    [String(field.id)]: {
                      message: translate(
                        "builder.fieldRenderer.invalidFileType",
                        {
                          allowed:
                            allowed.join(", "),
                        }
                      ),
                    },
                  }));

                  e.target.value = "";
                  return;
                }
              }

              setFieldErrors((prev) => {
                const updated = {
                  ...prev,
                };

                delete updated[
                  String(field.id)
                ];

                return updated;
              });

              const maxSizeMB =
                parsedConfig.max_size_mb || 10;

              if (
                file.size >
                maxSizeMB * 1024 * 1024
              ) {
                setFieldErrors((prev) => ({
                  ...prev,
                  [String(field.id)]: {
                    message: translate(
                      "builder.fieldRenderer.fileSizeExceeded",
                      {
                        maxSizeMB,
                      }
                    ),
                  },
                }));

                e.target.value = "";
                return;
              }

              try {
                const formData =
                  new FormData();

                formData.append(
                  "file",
                  file
                );

                const response =
                  await axios.post(
                    "http://localhost:8001/api/v1/files/upload",
                    formData,
                    {
                      headers: {
                        "Content-Type":
                          "multipart/form-data",
                      },
                    }
                  );

                console.log(
                  "Upload response:",
                  response.data
                );

                onChange(
                  response.data.file_key
                );
              } catch (error) {
                console.error(
                  "File upload failed:",
                  error
                );

                setFieldErrors((prev) => ({
                  ...prev,
                  [String(field.id)]: {
                    message: translate(
                      "builder.fieldRenderer.fileUploadFailed"
                    ),
                  },
                }));

                e.target.value = "";
              }
            }}
            required={isRequired}
          />
        );

      case "rating":
        return (
          <div
            className="rating-field"
            style={{
              display: "flex",
              gap: "6px",
              fontSize: "1.35rem",
              color: "#eab308",
              marginTop: "4px",
            }}
          >
            {Array.from(
              {
                length:
                  parsedConfig.scale || 5,
              },
              (_, i) => {
                const starRating = i + 1;

                return (
                  <span
                    key={i}
                    className="rating-star"
                    style={{
                      cursor: "pointer",
                      color:
                        starRating <= value
                          ? "#eab308"
                          : "#cbd5e1",
                    }}
                    onClick={() =>
                      onChange(starRating)
                    }
                  >
                    ★
                  </span>
                );
              }
            )}
          </div>
        );

      case "textarea":
        return (
          <textarea
            className="form-input"
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
            placeholder={
              placeholderText ||
              translate(
                "builder.fieldRenderer.enterResponse"
              )
            }
            rows={
              parsedConfig.rows || 4
            }
            maxLength={
              parsedConfig.max_length ||
              undefined
            }
            required={isRequired}
          />
        );

      default:
        return (
          <input
            type="text"
            className="form-input"
            value={value}
            onChange={(e) =>
              onChange(e.target.value)
            }
          />
        );
    }
  };

  return (
    <div
      className="form-field-wrapper"
      style={{
        marginBottom: "24px",
        textAlign: "left",
      }}
    >
      {showLabel && (
        <label
          className="form-label"
          style={{
            display: "block",
            fontWeight: "600",
            marginBottom: "8px",
            color: "var(--text-main)",
          }}
        >
          {labelText ||
            translate(
              "builder.fieldRenderer.untitledQuestion"
            )}

          {isRequired && (
            <span
              style={{
                color: "#ef4444",
                marginLeft: "2px",
              }}
            >
              *
            </span>
          )}
        </label>
      )}

      {renderInputElements()}
    </div>
  );
}

const FieldRenderer = ({
  field,
  value,
  onChange,
  error,
  setFieldErrors,
}) => {
  const { t } = useTranslation();

  return renderField(
    field,
    value,
    onChange,
    true,
    error,
    setFieldErrors,
    t
  );
};

export default FieldRenderer;