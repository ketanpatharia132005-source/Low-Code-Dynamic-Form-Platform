import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableField({
  field,
  renderField,
  selectedFieldId,
  setSelectedFieldId,
  rules = [],
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const relatedRules = rules.filter(
  (rule) =>
    rule.source_field_id === field.id ||
    rule.target_field_id === field.id
);

  return (
  <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    className={
      selectedFieldId === field.id
        ? "canvas-field modern selected"
        : "canvas-field modern"
    }
    onClick={() => setSelectedFieldId(field.id)}
  >
    <div className="canvas-field-header">

  <div>

    <div className="canvas-field-title">
      {field.label}

      {field.config?.required && (
        <span className="required-star">*</span>
      )}
    </div>

    <div className="field-type-badge">
      {field.field_type}
    </div>

  </div>

  <div className="drag-handle" title="Drag to reorder">
    ⠿
  </div>

</div>

    <div className="canvas-field-body">
      {renderField(field)}
    </div>

  </div>
);
}

export default SortableField;