import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableField from "./SortableField";

function renderField(field) {
  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          placeholder={field.placeholder}
        />
      );

    case "textarea":
      return (
        <textarea
          placeholder={field.placeholder}
          rows="4"
        />
      );

    case "email":
      return (
        <input
          type="email"
          placeholder={field.placeholder}
        />
      );

    case "password":
      return (
        <input
          type="password"
          placeholder={field.placeholder}
        />
      );

    case "number":
      return (
        <input
          type="number"
          placeholder={field.placeholder}
        />
      );

    case "date":
      return <input type="date" />;

    case "checkbox":
      return <input type="checkbox" />;

    case "radio":
      return <input type="radio" />;

    case "dropdown":
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

function Canvas({
  fields,
  selectedFieldId,
  setSelectedFieldId,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className="canvas"
      style={{
        border: isOver
          ? "2px dashed #1976d2"
          : "2px dashed transparent",
      }}
    >
      <h2>Form Canvas</h2>

      {fields.length === 0 ? (
        <p>Drag a field here or click a field type.</p>
      ) : (
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field) => (
            <SortableField
              key={field.id}
              field={field}
              renderField={renderField}
              selectedFieldId={selectedFieldId}
              setSelectedFieldId={setSelectedFieldId}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
}

export default Canvas;