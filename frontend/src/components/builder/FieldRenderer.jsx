import React from "react";

export function renderField(field) {
  if (!field) return null;

  // 1. DEBUG LOG: Open your browser inspect console (F12) to see exactly what keys your backend is sending!
  console.log("[DEBUG FieldRenderer] Received field payload:", field);

  // 2. SMART MAPPING: Extract values checking both camelCase and snake_case properties
  const fieldType = field.field_type || field.type || "text";
  const labelText = field.label || field.field_label || field.title || "";
  const isRequired = field.required || field.is_required || false;

  // 3. CONFIG EXTRACTOR: Handle raw JSON objects or stringified SQLite text columns cleanly
  let parsedConfig = {};
  if (field.config) {
    if (typeof field.config === "string") {
      try {
        parsedConfig = JSON.parse(field.config);
      } catch (e) {
        console.error("Could not parse field.config JSON string:", e);
      }
    } else {
      parsedConfig = field.config;
    }
  }

  // 4. PROPERTY RESOLUTION: Scan all common data spots for placeholders and options
  const placeholderText = parsedConfig.placeholder || field.placeholder || field.placeholder_text || "";
  
  let rawOptions = parsedConfig.options || field.options || field.field_options || [];
  let optionsArray = [];

  if (rawOptions) {
    if (typeof rawOptions === "string") {
      try {
        if (rawOptions.trim().startsWith("[")) {
          optionsArray = JSON.parse(rawOptions);
        } else {
          optionsArray = rawOptions.split(",").map((opt) => opt.trim());
        }
      } catch (e) {
        optionsArray = rawOptions.split(",").map((opt) => opt.trim());
      }
    } else if (Array.isArray(rawOptions)) {
      optionsArray = rawOptions;
    }
  }

  // 5. INPUT COMPONENT SWITCHBOARD
  const renderInputElements = () => {
    switch (fieldType) {
      case "text":
        return (
          <input 
            type="text" 
            className="form-input"
            placeholder={placeholderText || "Enter text..."} 
            maxLength={parsedConfig.max_length || undefined} 
            required={isRequired}
          />
        );
      case "number":
        return (
          <input 
            type="number" 
            className="form-input"
            placeholder={placeholderText || "Enter number..."}
            min={parsedConfig.min ?? undefined} 
            max={parsedConfig.max ?? undefined} 
            step={parsedConfig.integer_only ? 1 : "any"} 
            required={isRequired}
          />
        );
      case "email":
        return (
          <input 
            type="email" 
            className="form-input"
            placeholder={placeholderText || "Enter email address..."} 
            required={isRequired}
          />
        );
      case "date":
        return (
          <input 
            type="date" 
            className="form-input"
            min={parsedConfig.min_date || undefined} 
            max={parsedConfig.max_date || undefined} 
            required={isRequired}
          />
        );
      case "dropdown":
        return (
          <select className="form-select" required={isRequired} defaultValue="">
            <option value="" disabled>Select...</option>
            {optionsArray.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <div className="checkbox-group" style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
            {optionsArray.map((opt) => (
              <label key={opt} className="checkbox-option" style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" name={`checkbox-${field.id}`} value={opt} required={isRequired} />
                <span style={{ color: "var(--text-main)", fontSize: "0.95rem" }}>{opt}</span>
              </label>
            ))}
          </div>
        );
      case "file":
        return (
          <input 
            type="file" 
            className="form-input"
            accept={Array.isArray(parsedConfig.allowed_types) ? parsedConfig.allowed_types.join(",") : parsedConfig.allowed_types || undefined} 
            required={isRequired}
          />
        );
      case "rating":
        return (
          <div className="rating-field" style={{ display: "flex", gap: "6px", fontSize: "1.35rem", color: "#eab308", marginTop: "4px" }}>
            {Array.from({ length: parsedConfig.scale || 5 }, (_, i) => (
              <span key={i} className="rating-star">★</span>
            ))}
          </div>
        );
      default:
        return <input type="text" className="form-input" />;
    }
  };

  return (
    <div className="form-field-wrapper" style={{ marginBottom: "24px", textAlign: "left" }}>
      {/* Explicitly rendering labels above the inputs */}
      <label className="form-label" style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "var(--text-main)" }}>
        {labelText || "Untitled Question"} 
        {isRequired && <span style={{ color: "#ef4444", marginLeft: "2px" }}>*</span>}
      </label>
      
      {renderInputElements()}
    </div>
  );
}

const FieldRenderer = ({ field }) => {
  return renderField(field);
};

export default FieldRenderer;