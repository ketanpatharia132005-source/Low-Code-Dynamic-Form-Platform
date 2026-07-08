function PreviewForm({ fields }) {
  const renderPreviewField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            disabled
          />
        );

      case "email":
        return (
          <input
            type="email"
            placeholder={field.placeholder}
            disabled
          />
        );

      case "password":
        return (
          <input
            type="password"
            placeholder={field.placeholder}
            disabled
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            disabled
          />
        );

      case "date":
        return <input type="date" disabled />;

      case "tel":
        return (
          <input
            type="tel"
            placeholder={field.placeholder}
            disabled
          />
        );

      case "textarea":
        return (
          <textarea
            placeholder={field.placeholder}
            rows="4"
            disabled
          />
        );

      case "checkbox":
        return <input type="checkbox" disabled />;

      case "radio":
        return (
          <div>
            <label>
              <input type="radio" disabled />
              Option 1
            </label>
            <br />
            <label>
              <input type="radio" disabled />
              Option 2
            </label>
          </div>
        );

      case "select":
        return (
          <select disabled>
            <option>Select...</option>
          </select>
        );

      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            disabled
          />
        );
    }
  };

  return (
    <div className="preview-container">
      <h2>Form Preview</h2>

      {fields.map((field) => (
        <div
          key={field.id}
          className="canvas-field"
        >
          <label>
            {field.label}
            {field.required && (
              <span style={{ color: "red" }}> *</span>
            )}
          </label>

          {renderPreviewField(field)}
        </div>
      ))}
    </div>
  );
}

export default PreviewForm;