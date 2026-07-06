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

  // ✅ Create field with proper defaults
  const addField = (type) => {
    const fieldDefaults = {
      text: { label: "Text Field", placeholder: "Enter text" },
      number: { label: "Number Field", placeholder: "Enter number" },
      email: { label: "Email Field", placeholder: "Enter email" },
      password: { label: "Password Field", placeholder: "Enter password" },
      date: { label: "Date Field", placeholder: "" },
      tel: { label: "Phone Field", placeholder: "Enter phone number" },
      textarea: { label: "Text Area", placeholder: "Enter text" },
      checkbox: { label: "Checkbox", placeholder: "" },
      select: { label: "Dropdown", placeholder: "" },
      radio: { label: "Radio Group", placeholder: "" },
    };

    const config = fieldDefaults[type] || {
      label: "Field",
      placeholder: "",
    };

    const newField = {
      id: Date.now().toString(),
      type,
      label: config.label,
      placeholder: config.placeholder,

      // ✅ configuration system start
      required: false,
    };

    setFields((prev) => [...prev, newField]);
  };

  // ✅ Update any field property (label, placeholder, required, etc.)
  const updateField = (id, key, value) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  // ✅ Delete field
  const deleteField = (id) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== id)
    );

    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  // ✅ Drag & Drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Palette → Canvas
    if (active.data.current?.fromPalette) {
      if (over.id === "canvas-drop-zone") {
        addField(active.data.current.fieldType);
      }
      return;
    }

    // Canvas reorder
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
        {/* Left: Field Palette */}
        <FieldPalette addField={addField} />

        {/* Center: Canvas */}
        <Canvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
        />

        {/* Right: Properties Panel */}
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