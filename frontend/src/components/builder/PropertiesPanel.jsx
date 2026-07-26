function OptionsEditor({ options, onChange, disabled }) {
  const opts = options || [];

  const updateOption = (index, value) => {
    const next = [...opts];
    next[index] = value;
    onChange(next);
  };

  const addOption = () => onChange([...opts, `Option ${opts.length + 1}`]);

  const removeOption = (index) => onChange(opts.filter((_, i) => i !== index));

  return (
    <div className="property-group">
      <label>Options</label>
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
      <button type="button" disabled={disabled} onClick={addOption}>
        + Add Option
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
  if (!selectedField) {
  return (
    <div className="properties-panel empty-properties">
      <div className="empty-properties-icon">⚙️</div>

      <h3>No Field Selected</h3>

      <p>
        Click any field on the canvas to edit its properties
        and validation settings.
      </p>
    </div>
  );
}
  const { field_type, config = {} } = selectedField;
  const setConfig = (key, value) => updateFieldConfig(selectedField.id, key, value);

  const readOnlyMessage = disabled
  ? "Published or archived forms cannot be edited."
  : null;

  const confirmDelete = () => {
    if (window.confirm(`Delete "${selectedField.label}"?`)) {
      deleteField(selectedField.id);
    }
  };

  return (
    <div className="properties-panel">
       
       

      {readOnlyMessage && <p className="field-hint">{readOnlyMessage}</p>}

      <h3 className="section-title">Basic</h3>
      <div className="property-group">
        <label>Field Type</label>
        <input type="text" value={field_type} readOnly />
      </div>

      <div className="property-group">
        <label>Label</label>
        <input
          type="text"
          value={selectedField.label}
          disabled={disabled}
          onChange={(e) => updateField(selectedField.id, "label", e.target.value)}
        />
      </div>

      <h3 className="section-title">Configuration</h3>

      {(field_type === "text" || field_type === "email") && (
        <div className="property-group">
          <label>Placeholder</label>
          <input
            type="text"
            value={config.placeholder || ""}
            onChange={(e) => setConfig("placeholder", e.target.value)}
          />
        </div>
      )}

      {field_type === "text" && (
        <>
          <div className="property-group">
            <label>Min Length</label>
            <input
              type="number"
              value={config.min_length ?? 0}
              onChange={(e) => setConfig("min_length", Number(e.target.value))}
            />
          </div>
          <div className="property-group">
            <label>Max Length</label>
            <input
              type="number"
              value={config.max_length ?? 255}
              onChange={(e) => setConfig("max_length", Number(e.target.value))}
            />
          </div>
        </>
      )}

      {field_type === "number" && (
        <>
          <div className="property-group">
            <label>Min</label>
            <input
              type="number"
              value={config.min ?? ""}
              onChange={(e) =>
                setConfig("min", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>
          <div className="property-group">
            <label>Max</label>
            <input
              type="number"
              value={config.max ?? ""}
              onChange={(e) =>
                setConfig("max", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>

          <h3 className="section-title">Validation</h3>

          <div className="property-group">
            <label>
              <input
                type="checkbox"
                checked={config.integer_only || false}
                onChange={(e) => setConfig("integer_only", e.target.checked)}
              />{" "}
              Integer only
            </label>
          </div>
        </>
      )}

      {(field_type === "dropdown" || field_type === "checkbox") && (
        <OptionsEditor
          options={config.options}
          onChange={(next) => setConfig("options", next)}
          disabled={disabled}
        />
      )}

      {field_type === "date" && (
        <>
          <div className="property-group">
            <label>Min Date</label>
            <input
              type="date"
              value={config.min_date || ""}
              onChange={(e) => setConfig("min_date", e.target.value || null)}
            />
          </div>
          <div className="property-group">
            <label>Max Date</label>
            <input
              type="date"
              value={config.max_date || ""}
              onChange={(e) => setConfig("max_date", e.target.value || null)}
            />
          </div>
        </>
      )}

      {field_type === "file" && (
        <>
          <div className="property-group">
            <label>Allowed Types (comma-separated, e.g. .pdf,.png)</label>
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
            <label>Max Size (MB)</label>
            <input
              type="number"
              value={config.max_size_mb ?? 5}
              onChange={(e) => setConfig("max_size_mb", Number(e.target.value))}
            />
          </div>
        </>
      )}

      {field_type === "rating" && (
        <div className="property-group">
          <label>Scale (1-10)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={config.scale ?? 5}
            onChange={(e) => setConfig("scale", Number(e.target.value))}
          />
        </div>
      )}

      <div className="property-group">
        <label>
          <input
            type="checkbox"
            checked={config.required || false}
            onChange={(e) => setConfig("required", e.target.checked)}
          />{" "}
          Required
        </label>
      </div>

      <h3 className="section-title">Actions</h3>

      {selectedField.dirty && (
        <p className="unsaved-indicator">
           ⚠️ You have unsaved changes
        </p>
      )}
      <button
  className={`save-btn ${!selectedField.dirty ? "saved" : ""}`}
  type="button"
  disabled={disabled}
  onClick={() => saveField(selectedField.id)}
>
  {selectedField.dirty ? "💾 Save Changes" : "✅ Saved"}
</button>
      <button
         className="delete-btn"
         type="button"
         disabled={disabled}
         onClick={confirmDelete}
      >
         🗑 Delete Field
      </button>

      
    </div>
  );
}

export default PropertiesPanel;
