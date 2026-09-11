import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  getFormRules,
  createFormRule,
  deleteFormRule,
} from "../../api/api";

import "./RuleBuilder.css";

const RuleBuilder = ({ formId, fields = [] }) => {
  const { t } = useTranslation();

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
      setError(t("builder.ruleBuilder.loadFailed"));
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();

    if (!triggerFieldId || !targetFieldId) {
      setError(t("builder.ruleBuilder.selectFields"));
      return;
    }

    if (triggerFieldId === targetFieldId) {
      setError(t("builder.ruleBuilder.sameField"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ruleData = {
        trigger_field_id: String(triggerFieldId),
        operator,
        comparison_value:
          operator === "is_empty" ||
          operator === "is_not_empty"
            ? ""
            : comparisonValue,
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

      setError(t("builder.ruleBuilder.requestFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm(t("builder.ruleBuilder.deleteConfirmation"))) {
      return;
    }

    try {
      await deleteFormRule(formId, ruleId);
      await fetchRules();
    } catch (err) {
      console.error("Failed to delete rule:", err);
      setError(t("builder.ruleBuilder.deleteFailed"));
    }
  };

  const getFieldLabel = (fieldId) => {
    const field = fields.find(
      (f) => String(f.id ?? f._id) === String(fieldId)
    );

    return (
      field?.label ||
      field?.title ||
      t("builder.ruleBuilder.fieldFallback", {
        id: fieldId,
      })
    );
  };

  return (
    <div
      className="rule-builder-container"
      style={{ minHeight: "auto", overflow: "visible" }}
    >
      <div className="rule-builder-header">
        <div>
          <h2 className="rule-page-title">
            ⚡ {t("builder.ruleBuilder.title")}
          </h2>

          <p className="subtitle">
            {t("builder.ruleBuilder.subtitle")}
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
          <label>{t("builder.ruleBuilder.ifField")}</label>

          <select
            value={triggerFieldId}
            onChange={(e) => setTriggerFieldId(e.target.value)}
            required
            className="rule-select"
          >
            <option value="">
              {t("builder.ruleBuilder.selectTriggerField")}
            </option>

            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.label || field.title || t("builder.ruleBuilder.unnamedField")}
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
            <label>{t("builder.ruleBuilder.condition")}</label>

            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="rule-select"
            >
              <option value="equals">
                {t("builder.ruleBuilder.operators.equals")}
              </option>

              <option value="not_equals">
                {t("builder.ruleBuilder.operators.notEquals")}
              </option>

              <option value="greater_than">
                {t("builder.ruleBuilder.operators.greaterThan")}
              </option>

              <option value="less_than">
                {t("builder.ruleBuilder.operators.lessThan")}
              </option>

              <option value="greater_than_or_equal">
                {t("builder.ruleBuilder.operators.greaterThanOrEqual")}
              </option>

              <option value="less_than_or_equal">
                {t("builder.ruleBuilder.operators.lessThanOrEqual")}
              </option>

              <option value="contains">
                {t("builder.ruleBuilder.operators.contains")}
              </option>

              <option value="starts_with">
                {t("builder.ruleBuilder.operators.startsWith")}
              </option>

              <option value="ends_with">
                {t("builder.ruleBuilder.operators.endsWith")}
              </option>

              <option value="is_empty">
                {t("builder.ruleBuilder.operators.isEmpty")}
              </option>

              <option value="is_not_empty">
                {t("builder.ruleBuilder.operators.isNotEmpty")}
              </option>
            </select>
          </div>

          <div>
            <label>{t("builder.ruleBuilder.value")}</label>

            <input
              type="text"
              value={comparisonValue}
              onChange={(e) => setComparisonValue(e.target.value)}
              placeholder={t("builder.ruleBuilder.valuePlaceholder")}
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
            <label>{t("builder.ruleBuilder.thenAction")}</label>

            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="rule-select"
            >
              <option value="show">
                {t("builder.ruleBuilder.actions.show")}
              </option>

              <option value="hide">
                {t("builder.ruleBuilder.actions.hide")}
              </option>

              <option value="require">
                {t("builder.ruleBuilder.actions.require")}
              </option>
            </select>
          </div>

          <div>
            <label>{t("builder.ruleBuilder.targetField")}</label>

            <select
              value={targetFieldId}
              onChange={(e) => setTargetFieldId(e.target.value)}
              required
              className="rule-select"
            >
              <option value="">
                {t("builder.ruleBuilder.selectTargetField")}
              </option>

              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label ||
                    field.title ||
                    t("builder.ruleBuilder.unnamedField")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="rule-error-text">
            {error}
          </p>
        )}

        <div className="rule-action-bar">
          <button
            type="submit"
            disabled={loading}
            className="save-rule-btn"
          >
            {loading
              ? t("builder.ruleBuilder.savingRule")
              : `➕ ${t("builder.ruleBuilder.saveRule")}`}
          </button>
        </div>
      </form>

      <div className="rules-list-section">
        <h4>
          {t("builder.ruleBuilder.activeLogic")} ({rules.length})
        </h4>

        {rules.length === 0 ? (
          <div className="empty-rules">
            <p>
              {t("builder.ruleBuilder.noRules")}
            </p>
          </div>
        ) : (
          <div className="rules-list">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rule-flow-card"
              >
                <div className="flow-box trigger">
                  <span className="flow-title">
                    {t("builder.ruleBuilder.triggerField")}
                  </span>

                  <strong>
                    {getFieldLabel(rule.trigger_field_id)}
                  </strong>
                </div>

                <div className="flow-arrow">
                  ↓
                </div>

                <div className="flow-box condition">
                  <span className="flow-title">
                    {t("builder.ruleBuilder.condition")}
                  </span>

                  <strong>
                    {t(
                      `builder.ruleBuilder.operators.${rule.operator}`,
                      {
                        defaultValue: rule.operator.replaceAll(
                          "_",
                          " "
                        ),
                      }
                    )}
                  </strong>
                </div>

                {rule.comparison_value && (
                  <>
                    <div className="flow-arrow">
                      ↓
                    </div>

                    <div className="flow-box value">
                      <span className="flow-title">
                        {t("builder.ruleBuilder.value")}
                      </span>

                      <strong>
                        {rule.comparison_value}
                      </strong>
                    </div>
                  </>
                )}

                <div className="flow-arrow">
                  ↓
                </div>

                <div
                  className={`flow-box action ${rule.action}`}
                >
                  <span className="flow-title">
                    {t("builder.ruleBuilder.action")}
                  </span>

                  <strong>
                    {t(
                      `builder.ruleBuilder.actions.${rule.action}`,
                      {
                        defaultValue:
                          rule.action.toUpperCase(),
                      }
                    )}
                  </strong>
                </div>

                <div className="flow-arrow">
                  ↓
                </div>

                <div className="flow-box target">
                  <span className="flow-title">
                    {t("builder.ruleBuilder.targetField")}
                  </span>

                  <strong>
                    {getFieldLabel(rule.target_field_id)}
                  </strong>
                </div>

                <button
                  type="button"
                  className="btn-delete-rule"
                  onClick={() =>
                    handleDeleteRule(rule.id)
                  }
                  title={t(
                    "builder.ruleBuilder.deleteRule"
                  )}
                >
                  ×
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