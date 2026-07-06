const fields = [
  "Text",
  "Textarea",
  "Email",
  "Password",
  "Number",
  "Date",
  "Checkbox",
  "Radio",
  "Dropdown",
];

function FieldPalette({ addField }) {
  return (
    <div className="field-palette">
      <h2>Field Palette</h2>

      <div className="field-list">
        {fields.map((field) => (
          <div
            key={field}
            className="field-item"
            onClick={() => addField(field)}
          >
            {field}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FieldPalette;