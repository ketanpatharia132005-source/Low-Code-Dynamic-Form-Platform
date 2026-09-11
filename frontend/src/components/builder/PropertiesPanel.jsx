import { useTranslation } from "react-i18next";

function OptionsEditor({ options, onChange, disabled }) {
  const { t } = useTranslation();

  const opts = options || [];

  const updateOption = (index, value) => {
    const next = [...opts];
    next[index] = value;
    onChange(next);
  };

  const addOption = () =>
    onChange([
      ...opts,
      `${t("builder.properties.option")} ${opts.length + 1}`,
    ]);

  const removeOption = (index) =>
    onChange(opts.filter((_, i) => i !== index));

  return (
    <div className="property-group">
      <label>{t("builder.properties.options")}</label>

      {opts.map((opt, i) => (
        <div key={i} className="option-row">
          <input
            type="text"
            value={opt}
            disabled={disabled}
            onChange={(e) => updateOption(i, e.target.value)}
          />

          <button
            type="button"
            disabled={disabled}
            onClick={() => removeOption(i)}
          >
            X
          </button>
        </div>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={addOption}
      >
        + {t("builder.properties.addOption")}
      </button>
    </div>
  );
}

function PropertiesPanel({
  selectedField,
  updateField,
  updateFieldConfig,
  deleteField,
  saveField,
  disabled,
}) {
  const { t } = useTranslation();

  if (!selectedField) {
    return (
      <div className="properties-panel empty-properties">
        <div className="empty-properties-icon">⚙️</div>

        <h3>{t("builder.properties.noFieldSelected")}</h3>

        <p>
          {t("builder.properties.noFieldSelectedDescription")}
        </p>
      </div>
    );
  }

  const { field_type, config = {} } = selectedField;

  const setConfig = (key, value) =>
    updateFieldConfig(selectedField.id, key, value);

  const readOnlyMessage = disabled
    ? t("builder.publishedArchivedCannotEdit")
    : null;

  const confirmDelete = () => {
    if (
      window.confirm(
        t("builder.properties.deleteConfirmation", {
          label: selectedField.label,
        })
      )
    ) {
      deleteField(selectedField.id);
    }
  };

  return (
    <div className="properties-panel">
      {readOnlyMessage && (
        <p className="field-hint">{readOnlyMessage}</p>
      )}

      <h3 className="section-title">
        {t("builder.properties.basic")}
      </h3>

      <div className="property-group">
        <label>{t("builder.properties.fieldType")}</label>

        <input
          type="text"
          value={t(`builder.fieldTypes.${field_type}`, {
            defaultValue: field_type,
          })}
          readOnly
        />
      </div>

      <div className="property-group">
        <label>{t("builder.properties.label")}</label>

        <input
          type="text"
          value={selectedField.label}
          disabled={disabled}
          onChange={(e) =>
            updateField(
              selectedField.id,
              "label",
              e.target.value
            )
          }
        />
      </div>

      <h3 className="section-title">
        {t("builder.properties.configuration")}
      </h3>

      {(field_type === "text" || field_type === "email") && (
        <div className="property-group">
          <label>{t("builder.properties.placeholder")}</label>

          <input
            type="text"
            value={config.placeholder || ""}
            onChange={(e) =>
              setConfig("placeholder", e.target.value)
            }
          />
        </div>
      )}

      {field_type === "text" && (
        <>
          <div className="property-group">
            <label>{t("builder.properties.minLength")}</label>

            <input
              type="number"
              value={config.min_length ?? 0}
              onChange={(e) =>
                setConfig(
                  "min_length",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="property-group">
            <label>{t("builder.properties.maxLength")}</label>

            <input
              type="number"
              value={config.max_length ?? 255}
              onChange={(e) =>
                setConfig(
                  "max_length",
                  Number(e.target.value)
                )
              }
            />
          </div>
        </>
      )}

      {field_type === "number" && (
        <>
          <div className="property-group">
            <label>{t("builder.properties.min")}</label>

            <input
              type="number"
              value={config.min ?? ""}
              onChange={(e) =>
                setConfig(
                  "min",
                  e.target.value === ""
                    ? null
                    : Number(e.target.value)
                )
              }
            />
          </div>

          <div className="property-group">
            <label>{t("builder.properties.max")}</label>

            <input
              type="number"
              value={config.max ?? ""}
              onChange={(e) =>
                setConfig(
                  "max",
                  e.target.value === ""
                    ? null
                    : Number(e.target.value)
                )
              }
            />
          </div>

          <h3 className="section-title">
            {t("builder.properties.validation")}
          </h3>

          <div className="property-group">
            <label>
              <input
                type="checkbox"
                checked={config.integer_only || false}
                onChange={(e) =>
                  setConfig(
                    "integer_only",
                    e.target.checked
                  )
                }
              />{" "}
              {t("builder.properties.integerOnly")}
            </label>
          </div>
        </>
      )}

      {(field_type === "dropdown" ||
        field_type === "checkbox") && (
        <OptionsEditor
          options={config.options}
          onChange={(next) =>
            setConfig("options", next)
          }
          disabled={disabled}
        />
      )}

      {field_type === "date" && (
        <>
          <div className="property-group">
            <label>
              {t("builder.properties.minDate")}
            </label>

            <input
              type="date"
              value={config.min_date || ""}
              onChange={(e) =>
                setConfig(
                  "min_date",
                  e.target.value || null
                )
              }
            />
          </div>

          <div className="property-group">
            <label>
              {t("builder.properties.maxDate")}
            </label>

            <input
              type="date"
              value={config.max_date || ""}
              onChange={(e) =>
                setConfig(
                  "max_date",
                  e.target.value || null
                )
              }
            />
          </div>
        </>
      )}

      {field_type === "file" && (
        <>
          <div className="property-group">
            <label>
              {t("builder.properties.allowedTypes")}
            </label>

            <input
              type="text"
              value={(config.allowed_types || []).join(", ")}
              onChange={(e) =>
                setConfig(
                  "allowed_types",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          </div>

          <div className="property-group">
            <label>
              {t("builder.properties.maxSize")}
            </label>

            <input
              type="number"
              value={config.max_size_mb ?? 5}
              onChange={(e) =>
                setConfig(
                  "max_size_mb",
                  Number(e.target.value)
                )
              }
            />
          </div>
        </>
      )}

      {field_type === "rating" && (
        <div className="property-group">
          <label>
            {t("builder.properties.scale")}
          </label>

          <input
            type="number"
            min={1}
            max={10}
            value={config.scale ?? 5}
            onChange={(e) =>
              setConfig(
                "scale",
                Number(e.target.value)
              )
            }
          />
        </div>
      )}

      <div className="property-group">
        <label>
          <input
            type="checkbox"
            checked={config.required || false}
            onChange={(e) =>
              setConfig(
                "required",
                e.target.checked
              )
            }
          />{" "}
          {t("builder.properties.required")}
        </label>
      </div>

      <h3 className="section-title">
        {t("builder.properties.actions")}
      </h3>

      {selectedField.dirty && (
        <p className="unsaved-indicator">
          ⚠️ {t("builder.properties.unsavedChanges")}
        </p>
      )}

      <button
        className={`save-btn ${
          !selectedField.dirty ? "saved" : ""
        }`}
        type="button"
        disabled={disabled}
        onClick={() =>
          saveField(selectedField.id)
        }
      >
        {selectedField.dirty
          ? `💾 ${t("builder.properties.saveChanges")}`
          : `✅ ${t("builder.properties.saved")}`}
      </button>

      <button
        className="delete-btn"
        type="button"
        disabled={disabled}
        onClick={confirmDelete}
      >
        🗑 {t("builder.properties.deleteField")}
      </button>
    </div>
  );
}

export default PropertiesPanel;