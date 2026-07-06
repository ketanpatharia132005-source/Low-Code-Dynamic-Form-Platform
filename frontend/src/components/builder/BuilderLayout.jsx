import { useState } from "react";
import "./Builder.css";

import FieldPalette from "./FieldPalette";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";

function BuilderLayout() {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `${type} Field`,
      placeholder: `Enter ${type.toLowerCase()}`
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

  return (
    <div className="builder-container">
      <FieldPalette addField={addField} />

      <Canvas 
           fields={fields} 
           selectedFieldId={selectedFieldId}
           setSelectedFieldId={setSelectedFieldId}
      />

      <PropertiesPanel 
          selectedField={
             fields.find((field) => field.id === selectedFieldId)
           }
           updateField={updateField}
           deleteField={deleteField}
       />
        
    </div>
  );
}

export default BuilderLayout;