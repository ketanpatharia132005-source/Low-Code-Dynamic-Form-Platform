// src/components/builder/FieldRenderer.jsx

// 1. Keep your original function (for Canvas.jsx)
export function renderField(field) {
  const { field_type, config = {} } = field;

  switch (field_type) {
    case "text":
      return <input type="text" placeholder={config.placeholder || ""} maxLength={config.max_length || undefined} />;
    case "number":
      return <input type="number" min={config.min ?? undefined} max={config.max ?? undefined} step={config.integer_only ? 1 : "any"} />;
    case "email":
      return <input type="email" placeholder={config.placeholder || ""} />;
    case "date":
      return <input type="date" min={config.min_date || undefined} max={config.max_date || undefined} />;
    case "dropdown":
      return (
        <select>
          <option value="">Select...</option>
          {(config.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    case "checkbox":
      return (
        <div className="checkbox-group">
          {(config.options || []).map((opt) => (
            <label key={opt} className="checkbox-option">
              <input type="checkbox" name={`checkbox-${field.id}`} value={opt} />
              {opt}
            </label>
          ))}
        </div>
      );
    case "file":
      return <input type="file" accept={(config.allowed_types || []).join(",")} />;
    case "rating":
      return (
        <div className="rating-field">
          {Array.from({ length: config.scale || 5 }, (_, i) => <span key={i} className="rating-star">*</span>)}
        </div>
      );
    default:
      return <input type="text" />;
  }
}

// 2. Create the Component wrapper (for PublicFormView.jsx)
const FieldRenderer = ({ field }) => {
  return renderField(field);
};

// 3. Keep both exports
export default FieldRenderer;