import { useDraggable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";

function DraggablePaletteItem({ fieldType, addField, disabled }) {
  const { t } = useTranslation();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${fieldType.type}`,
    data: {
      fromPalette: true,
      fieldType: fieldType.type,
    },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={disabled ? "field-item disabled" : "field-item"}
      onClick={() => {
        if (!disabled) addField(fieldType.type);
      }}
      {...listeners}
      {...attributes}
    >
      <div className="field-item-icon">
        {getFieldIcon(fieldType.type)}
      </div>

      <div className="field-item-content">
        <div className="field-item-title">
          {t(`builder.fieldTypes.${fieldType.type}`, {
            defaultValue: fieldType.label,
          })}
        </div>

        <div className="field-item-subtitle">
          {t("builder.dragOrClickToAdd")}
        </div>
      </div>
    </div>
  );
}

function getFieldIcon(type) {
  switch (type) {
    case "text":
      return "📝";

    case "email":
      return "📧";

    case "number":
      return "🔢";

    case "dropdown":
      return "▼";

    case "checkbox":
      return "☑";

    case "date":
      return "📅";

    case "file":
      return "📁";

    case "rating":
      return "⭐";

    default:
      return "📄";
  }
}

function FieldPalette({ fieldTypes, loading, addField, disabled }) {
  const { t } = useTranslation();

  return (
    <div className="field-palette">
      {loading && (
        <p>{t("builder.loadingComponents")}</p>
      )}

      {!loading && fieldTypes.length === 0 && (
        <p className="field-hint">
          {t("builder.fieldTypesLoadFailed")}
        </p>
      )}

      {disabled && (
        <p className="field-hint">
          {t("builder.publishedArchivedCannotEdit")}
        </p>
      )}

      <div className="field-list">
        {fieldTypes.map((fieldType) => (
          <DraggablePaletteItem
            key={fieldType.type}
            fieldType={fieldType}
            addField={addField}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default FieldPalette;