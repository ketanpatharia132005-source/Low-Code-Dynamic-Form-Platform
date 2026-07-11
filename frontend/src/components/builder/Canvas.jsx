import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { renderField } from "./FieldRenderer";
import SortableField from "./SortableField";

function Canvas({ fields, selectedFieldId, setSelectedFieldId }) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop-zone" });

  return (
    <div
      ref={setNodeRef}
      className="canvas"
      style={{
        border: isOver ? "2px dashed #1976d2" : "2px dashed transparent",
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
