import { useDraggable } from "@dnd-kit/core";

const fieldTypes = [
  {
    type: "text",
    label: "Text Field",
  },
  {
    type: "number",
    label: "Number Field",
  },
  {
    type: "email",
    label: "Email Field",
  },
  {
    type: "password",
    label: "Password Field",
  },
  {
    type: "date",
    label: "Date Field",
  },
  {
    type: "tel",
    label: "Phone Field",
  },
  {
    type: "textarea",
    label: "Text Area",
  },
  {
    type: "checkbox",
    label: "Checkbox",
  },
  {
    type: "select",
    label: "Dropdown",
  },
  {
    type: "radio",
    label: "Radio Group",
  },
];

function DraggablePaletteItem({ field, addField }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${field.type}`,
    data: {
      fromPalette: true,
      fieldType: field.type,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="field-item"
      onClick={() => addField(field.type)}
      {...listeners}
      {...attributes}
    >
      {field.label}
    </div>
  );
}

function FieldPalette({ addField }) {
  return (
    <div className="field-palette">
      <h3>Field Palette</h3>

      <div className="field-list">
        {fieldTypes.map((field) => (
          <DraggablePaletteItem
            key={field.type}
            field={field}
            addField={addField}
          />
        ))}
      </div>
    </div>
  );
}

export default FieldPalette;