function PropertiesPanel({
  selectedField,
  updateField,
  deleteField,
}) {
  if (!selectedField) {
    return (
      <div className="properties-panel">
        <h2>Properties</h2>
        <p>Select a field to view its properties.</p>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h2>Properties</h2>

      <div className="property-group">
        <label>Field Type</label>
        <input
          type="text"
          value={selectedField.type}
          readOnly
        />
      </div>

      <div className="property-group">
        <label>Label</label>
        <input
          type="text"
          value={selectedField.label}
          onChange={(e) =>
            updateField(
              selectedField.id,
              "label",
              e.target.value
            )
          }
        />
      </div>

      <div className="property-group">
        <label>Placeholder</label>
        <input
          type="text"
          value={selectedField.placeholder}
          onChange={(e) =>
            updateField(
              selectedField.id,
              "placeholder",
              e.target.value
            )
          }
        />
      </div>

      <div className="property-group">
        <label>
          <input
            type="checkbox"
            checked={selectedField.required}
            onChange={(e) =>
              updateField(
                selectedField.id,
                "required",
                e.target.checked
              )
            }
          />
          {" "}Required
        </label>
      </div>

      <button
        className="delete-btn"
        onClick={() => deleteField(selectedField.id)}
      >
        Delete Field
      </button>
    </div>
  );
}

export default PropertiesPanel;