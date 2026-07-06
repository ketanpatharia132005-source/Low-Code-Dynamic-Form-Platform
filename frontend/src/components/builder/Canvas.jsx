function renderField(field) {
  switch (field.type) {
    case "Text":
      return (
        <input
          type="text"
          placeholder={field.placeholder}
        />
      );

    case "Textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          rows="4"
        />
      );

    case "Email":
      return (
        <input
          type="email"
          placeholder={field.placeholder}
        />
      );

    case "Password":
      return (
        <input
          type="password"
          placeholder={field.placeholder}
        />
      );

    case "Number":
      return (
        <input
          type="number"
          placeholder={field.placeholder}
        />
      );

    case "Date":
      return (
        <input type="date" />
      );

    case "Checkbox":
      return (
        <input type="checkbox" />
      );

    case "Radio":
      return (
        <input type="radio" />
      );

    case "Dropdown":
      return (
        <select>
          <option>Select...</option>
        </select>
      );

    default:
      return (
        <input
          type="text"
          placeholder={field.placeholder}
        />
      );
  }
}

function Canvas({ fields,
                  selectedFieldId,
                  setSelectedFieldId
                  
              }) {
  return (
    <div className="canvas">
      <h2>Form Canvas</h2>

      {fields.length === 0 ? (
        <p>No fields added yet.</p>
      ) : (
        fields.map((field) => (
          <div
               key={field.id}
               className={
                    selectedFieldId === field.id
                        ? "canvas-field selected"
                        : "canvas-field"
    }
    onClick={() => setSelectedFieldId(field.id)}
>
            <label>{field.label}</label>

            {renderField(field)}
          </div>
        ))
      )}
    </div>
  );
}

export default Canvas;