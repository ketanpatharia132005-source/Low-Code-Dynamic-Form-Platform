import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableField({
  field,
  renderField,
  selectedFieldId,
  setSelectedFieldId,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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
  );
}

export default SortableField;