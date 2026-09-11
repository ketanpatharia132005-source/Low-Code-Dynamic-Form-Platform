import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";

function SortableField({
  field,
  renderField,
  selectedFieldId,
  setSelectedFieldId,
  rules = [],
}) {
  const { t } = useTranslation();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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

  /*
   * Translate the default field labels that Form Craft creates.
   *
   * If the user has manually changed the field label,
   * keep their custom label exactly as entered.
   */
  const defaultLabels = {
    text: "Text",
    email: "Email",
    number: "Number",
    dropdown: "Dropdown",
    checkbox: "Checkbox",
    date: "Date",
    file: "File Upload",
    rating: "Rating",
  };

  const translatedDefaultLabel = t(
    `builder.fieldTypes.${field.field_type}`,
    {
      defaultValue: defaultLabels[field.field_type] || field.field_type,
    }
  );

  const displayLabel =
    field.label === defaultLabels[field.field_type]
      ? translatedDefaultLabel
      : field.label;

  const translatedFieldType = t(
    `builder.fieldTypes.${field.field_type}`,
    {
      defaultValue: field.field_type,
    }
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
            {t(`builder.fieldTypes.${field.field_type}`, {
              defaultValue: field.field_type,
            })}
          </div>
        </div>

        <div
          className="drag-handle"
          title={t("builder.dragToReorder")}
        >
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