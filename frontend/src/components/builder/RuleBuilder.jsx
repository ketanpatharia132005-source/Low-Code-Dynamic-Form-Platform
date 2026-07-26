import React, { useState, useEffect } from "react";
import {
  getFormRules,
  createFormRule,
  deleteFormRule,
} from "../../api/api";
import "./RuleBuilder.css";

const RuleBuilder = ({ formId, fields = [] }) => {
  console.log("RuleBuilder formId:", formId);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [triggerFieldId, setTriggerFieldId] = useState("");
  const [operator, setOperator] = useState("equals");
  const [comparisonValue, setComparisonValue] = useState("");
  const [targetFieldId, setTargetFieldId] = useState("");
  const [action, setAction] = useState("show");

  useEffect(() => {
    if (formId) {
      fetchRules();
    }
  }, [formId]);

  const fetchRules = async () => {
    try {
      const res = await getFormRules(formId);
      setRules(res.data);
    } catch (err) {
      console.error("Failed to fetch logic rules:", err);
      setError("Failed to load conditional rules.");
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();

    if (!triggerFieldId || !targetFieldId) {
      setError("Please select both a trigger field and a target field.");
      return;
    }

    if (triggerFieldId === targetFieldId) {
      setError("Trigger field and target field cannot be the same.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ruleData = {
        trigger_field_id: String(triggerFieldId),
        operator,
        comparison_value: 
           operator ==="is_empty" ||
           operator ==="is_not_empty"? "":comparisonValue,
        target_field_id: String(targetFieldId),
        action,
      };

      await createFormRule(formId, ruleData);

      setTriggerFieldId("");
      setComparisonValue("");
      setTargetFieldId("");
      setOperator("equals");
      setAction("show");

      await fetchRules();
    } catch (err) {
  console.log("========== RULE CREATE ERROR ==========");
  console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);
  console.log("DETAIL:", err.response?.data?.detail);

  setError("Request failed. Check Console.");
} finally {
  setLoading(false);
}
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) {
      return;
    }

    try {
      await deleteFormRule(formId, ruleId);
      await fetchRules();
    } catch (err) {
      console.error("Failed to delete rule:", err);
      setError("Failed to delete rule.");
    }
  };

  const getFieldLabel = (fieldId) => {
    const field = fields.find(
      (f) => String(f.id ?? f._id) === String(fieldId)
    );

    return field?.label || field?.title || `Field (${fieldId})`;
  };

  return (
    <div
      className="rule-builder-container"
      style={{ minHeight: "auto", overflow: "visible" }}
    >
      <div className="rule-builder-header">

  <div>
    <h2 className="rule-page-title">
      ⚡ Conditional Logic Builder
    </h2>

    <p className="subtitle">
      Create dynamic rules to show, hide or require fields automatically.
    </p>
  </div>

</div>

      <form
        onSubmit={handleCreateRule}
        className="rule-creator-form"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="form-row-group">
          <label>If Field</label>

          <select
            value={triggerFieldId}
            onChange={(e) => setTriggerFieldId(e.target.value)}
            required
            className="rule-select"
          >
            <option value="">-- Select Trigger Field --</option>

            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.label || field.title || "Unnamed Field"}
              </option>
            ))}
          </select>
        </div>

        <div
          className="form-row-group"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label>Condition</label>

            <select
               value={operator}
               onChange={(e) => setOperator(e.target.value)}
               className="rule-select"
            >
               <option value="equals">Equals</option>
               <option value="not_equals">Not Equals</option>
               <option value="greater_than">Greater Than</option>
               <option value="less_than">Less Than</option>
               <option value="greater_than_or_equal">Greater Than or Equal</option>
               <option value="less_than_or_equal">Less Than or Equal</option>
               <option value="contains">Contains</option>
               <option value="starts_with">Starts With</option>
               <option value="ends_with">Ends With</option>
               <option value="is_empty">Is Empty</option>
               <option value="is_not_empty">Is Not Empty</option>
            </select>
          </div>

          <div>
            <label>Value</label>

            <input
              type="text"
              value={comparisonValue}
              onChange={(e) => setComparisonValue(e.target.value)}
              placeholder="Value..."
              disabled={
                operator === "is_empty" ||
                operator === "is_not_empty"
              }
              required={
                operator !== "is_empty" &&
                operator !== "is_not_empty"
              }
              className="rule-input"
              style={{
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div
          className="form-row-group"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label>Then Action</label>

            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rule-select"
            >
              <option value="show">Show</option>
              <option value="hide">Hide</option>
              <option value="require">Require</option>
            </select>
          </div>

          <div>
            <label>Target Field</label>

            <select
              value={targetFieldId}
              onChange={(e) => setTargetFieldId(e.target.value)}
              required
              className="rule-select"
            >
              <option value="">-- Select Target Field --</option>

              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label || field.title || "Unnamed Field"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="rule-error-text">{error}</p>}

         <div className="rule-action-bar">

  <button
    type="submit"
    disabled={loading}
    className="save-rule-btn"
  >
    {loading ? "Saving Rule..." : "➕ Save Rule"}
  </button>

</div>
    
      </form>

      <div className="rules-list-section">
        <h4>Active Form Logic ({rules.length})</h4>

        {rules.length === 0 ? (
          <div className="empty-rules">

  <div className="empty-rule-icon">
    ⚙️
  </div>

  <h3>No Conditional Rules Yet</h3>

  <p>
    Create your first rule to make the form dynamic.
    You can automatically show, hide or require fields.
  </p>

</div>
        ) : (
          <div className="rules-list">
            {rules.map((rule) => (
              <div key={rule.id} className="rule-item-card modern-rule-card">
                <div className="rule-statement">
                  <span className="rule-keyword">IF</span>{" "}
                  <strong>
                    {getFieldLabel(rule.trigger_field_id)}
                  </strong>{" "}
                  <span className="rule-operator">
                    {rule.operator.replace("_", " ")}
                  </span>{" "}
                  {rule.operator !== "is_empty" && (
                    <span className="rule-value">
                      "{rule.comparison_value}"
                    </span>
                  )}{" "}
                  <span className="rule-keyword">THEN</span>{" "}
                  <span className="rule-action-badge">
                    {rule.action}
                  </span>{" "}
                  <strong>
                    {getFieldLabel(rule.target_field_id)}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteRule(rule.id)}
                  className="btn-delete-rule"
                  title="Delete Rule"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleBuilder;