import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import "./Builder.css";

import FieldPalette from "./FieldPalette";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";

function BuilderLayout() {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const addField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      label: `${type} Field`,
      placeholder: `Enter ${type}`,
    };

    setFields((prev) => [...prev, newField]);
  };

  const updateField = (id, key, value) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, [key]: value }
          : field
      )
    );
  };

  const deleteField = (id) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== id)
    );

    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Palette -> Canvas
    if (active.data.current?.fromPalette) {
      if (over.id === "canvas-drop-zone") {
        addField(active.data.current.fieldType);
      }
      return;
    }

    // Canvas -> Canvas
    if (active.id === over.id) return;

    setFields((items) => {
      const oldIndex = items.findIndex(
        (item) => item.id === active.id
      );

      const newIndex = items.findIndex(
        (item) => item.id === over.id
      );

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="builder-container">
        <FieldPalette addField={addField} />

        <Canvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
        />

        <PropertiesPanel
          selectedField={
            fields.find(
              (field) => field.id === selectedFieldId
            )
          }
          updateField={updateField}
          deleteField={deleteField}
        />
      </div>
    </DndContext>
  );
}

export default BuilderLayout;