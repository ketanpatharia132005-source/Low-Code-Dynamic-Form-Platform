function renderPreviewField(field) {
  const { field_type, config = {} } = field;

  switch (field_type) {
    case "text":
      return <input type="text" placeholder={config.placeholder || ""} disabled />;

    case "number":
      return <input type="number" disabled />;

    case "email":
      return <input type="email" placeholder={config.placeholder || ""} disabled />;

    case "date":
      return <input type="date" disabled />;

    case "dropdown":
      return (
        <select disabled>
          <option value="">Select...</option>
          {(config.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case "checkbox":
      return (
        <div className="checkbox-group">
          {(config.options || []).map((opt) => (
            <label key={opt} className="checkbox-option">
              <input type="checkbox" disabled /> {opt}
            </label>
          ))}
        </div>
      );

    case "file":
      return <input type="file" disabled />;

    case "rating":
      return (
        <div className="rating-field">
          {Array.from({ length: config.scale || 5 }, (_, i) => (
            <span key={i} className="rating-star">
              *
            </span>
          ))}
        </div>
      );

    default:
      return <input type="text" disabled />;
  }
}

function PreviewForm({ fields }) {
  return (
    <div className="preview-container">
      <h2>Form Preview</h2>

      {fields.map((field) => (
        <div key={field.id} className="canvas-field">
          <label>
            {field.label}
            {field.config?.required && <span style={{ color: "red" }}> *</span>}
          </label>

          {renderPreviewField(field)}
        </div>
      ))}
    </div>
  );
}

export default PreviewForm;
