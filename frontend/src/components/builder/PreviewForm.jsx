import React, { useState } from "react";

// This keeps your existing rendering logic, but adds the visibility filter
function PreviewForm({ fields = [], rules = [] }) {
  const [formValues, setFormValues] = useState({});

  // LOG: See what data is actually arriving in the component
  console.log("PreviewForm Data - Fields:", fields);
  console.log("PreviewForm Data - Rules:", rules);

  const isVisible = (field) => {
    // 1. Safety check: If no rules, show everything
    if (!rules || rules.length === 0) return true;

    // 2. Find rule for this field
    const fieldId = String(field.id);
    const relevantRule = rules.find(r => String(r.target_field_id) === fieldId);

    // 3. If no rule for this field, show it
    if (!relevantRule) return true;

    // 4. Get the value the user selected for the trigger
    const triggerVal = formValues[relevantRule.trigger_field_id];
    
    // 5. Logic check
    if (relevantRule.operator === "equals" && String(triggerVal) === String(relevantRule.comparison_value)) {
        return relevantRule.action === "show";
    }
    
    // If we get here, the rule is not met
    return relevantRule.action === "hide";
  };

  const handleInputChange = (fieldId, value) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  return (
    <div className="preview-container">
      <h2>Form Preview</h2>
      {fields.filter(isVisible).map((field) => (
        <div key={field.id} className="preview-field">
          <label>
            {field.label}
            {field.config?.required && <span style={{ color: "red" }}> *</span>}
          </label>
          
          {/* Use standard HTML input - no "disabled" attribute so you can test it */}
          {field.field_type === "text" && (
  <input
    type="text"
    placeholder={field.config?.placeholder || ""}
    value={formValues[field.id] || ""}
    onChange={(e) => handleInputChange(field.id, e.target.value)}
  />
)}

{field.field_type === "email" && (
  <input
    type="email"
    placeholder={field.config?.placeholder || ""}
    value={formValues[field.id] || ""}
    onChange={(e) => handleInputChange(field.id, e.target.value)}
  />
)}

{field.field_type === "number" && (
  <input
    type="number"
    value={formValues[field.id] || ""}
    onChange={(e) => handleInputChange(field.id, e.target.value)}
  />
)}

{field.field_type === "textarea" && (
  <textarea
    placeholder={field.config?.placeholder || ""}
    value={formValues[field.id] || ""}
    onChange={(e) => handleInputChange(field.id, e.target.value)}
  />
)}

{field.field_type === "date" && (
  <input
    type="date"
    value={formValues[field.id] || ""}
    onChange={(e) => handleInputChange(field.id, e.target.value)}
  />
)}

{field.field_type === "dropdown" && (
  <select
    value={formValues[field.id] || ""}
    onChange={(e) => handleInputChange(field.id, e.target.value)}
  >
    <option value="">Select...</option>

    {(field.config?.options || []).map((opt, index) => (
      <option key={index} value={opt}>
        {opt}
      </option>
    ))}
  </select>
)}

{field.field_type === "checkbox" && (
  <div className="preview-checkbox-group">
    {(field.config?.options || []).map((opt, index) => (
      <label key={index}>
        <input
          type="checkbox"
          checked={(formValues[field.id] || []).includes(opt)}
          onChange={(e) => {
            const current = formValues[field.id] || [];

            if (e.target.checked) {
              handleInputChange(field.id, [...current, opt]);
            } else {
              handleInputChange(
                field.id,
                current.filter((x) => x !== opt)
              );
            }
          }}
        />
        {opt}
      </label>
    ))}
  </div>
)}
        </div>
      ))}
    </div>
  );
}

export default PreviewForm;