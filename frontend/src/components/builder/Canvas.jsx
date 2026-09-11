import { useDroppable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { renderField } from "./FieldRenderer";
import SortableField from "./SortableField";

function Canvas({
  fields,
  selectedFieldId,
  setSelectedFieldId,
}) {
  const { t } = useTranslation();

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className="canvas"
      style={{
        border: isOver
          ? "2px dashed #4f46e5"
          : "2px dashed transparent",

        background: isOver
          ? "#f5f3ff"
          : undefined,

        transition: "all .25s ease",
      }}
    >
      <div className="canvas-header">
        {fields.length > 0 && (
          <span className="canvas-count">
            {fields.length}{" "}
            {fields.length === 1
              ? t("builder.field")
              : t("builder.fields")}
          </span>
        )}
      </div>

      {fields.length === 0 ? (
        <div className="empty-canvas">
          <div className="empty-icon">
            📋
          </div>

          <h3>
            {t("builder.canvasEmpty")}
          </h3>

          <p>
            {t(
              "builder.canvasEmptyDescription"
            )}
          </p>
        </div>
      ) : (
        <SortableContext
          items={fields.map(
            (field) => field.id
          )}
          strategy={
            verticalListSortingStrategy
          }
        >
          {fields.map((field) => (
            <SortableField
              key={field.id}
              field={field}
              renderField={(field) =>
                renderField(
                  field,
                  "",
                  () => {},
                  false,
                  null,
                  () => {},
                  t
                )
              }
              selectedFieldId={
                selectedFieldId
              }
              setSelectedFieldId={
                setSelectedFieldId
              }
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
}

export default Canvas;