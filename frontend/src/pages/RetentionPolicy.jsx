import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import "./RetentionPolicy.css";

function RetentionPolicy() {
  const { t } = useTranslation();
  const { formId } = useParams();

  const [policy, setPolicy] = useState({
    retention_days: 30,
    action: "archive",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPolicy();
  }, []);

  async function fetchPolicy() {
    try {
      const res = await api.get(
        `/retention/${formId}`
      );

      setPolicy({
        retention_days:
          res.data.retention_days,
        action: res.data.action,
        is_active: res.data.is_active,
      });
    } catch (err) {
      // Ignore if no policy exists yet
      if (err.response?.status !== 404) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function savePolicy() {
    try {
      setSaving(true);

      await api.post(`/retention/${formId}`, {
        retention_days:
          policy.retention_days,
        action: policy.action,
        is_active: policy.is_active,
      });

      alert(
        t(
          "retentionPolicy.updateSuccess"
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        t(
          "retentionPolicy.updateFailed"
        )
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="retention-loading">
        {t("retentionPolicy.loading")}
      </div>
    );
  }

  return (
    <div className="retention-page">
      <div className="retention-card">

        <h2>
          {t("retentionPolicy.title")}
        </h2>

        <div className="setting-row">
          <label>
            {t(
              "retentionPolicy.automaticCleanup"
            )}
          </label>

          <input
            type="checkbox"
            checked={policy.is_active}
            onChange={(e) =>
              setPolicy({
                ...policy,
                is_active:
                  e.target.checked,
              })
            }
          />
        </div>

        <div className="setting-row">
          <label>
            {t(
              "retentionPolicy.retentionDays"
            )}
          </label>

          <input
            type="number"
            min="1"
            value={policy.retention_days}
            onChange={(e) =>
              setPolicy({
                ...policy,
                retention_days:
                  Number(e.target.value),
              })
            }
          />
        </div>

        <div className="setting-row">
          <label>
            {t("retentionPolicy.action")}
          </label>

          <select
            value={policy.action}
            onChange={(e) =>
              setPolicy({
                ...policy,
                action: e.target.value,
              })
            }
          >
            <option value="archive">
              {t(
                "retentionPolicy.archive"
              )}
            </option>

            <option value="delete">
              {t(
                "retentionPolicy.delete"
              )}
            </option>
          </select>
        </div>

        <button
          className="save-policy-btn"
          onClick={savePolicy}
          disabled={saving}
        >
          {saving
            ? t("retentionPolicy.saving")
            : t("retentionPolicy.savePolicy")}
        </button>

      </div>
    </div>
  );
}

export default RetentionPolicy;