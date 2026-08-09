import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "./RetentionPolicy.css";

function RetentionPolicy() {
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
      const res = await api.get(`/retention/${formId}`);

      setPolicy({
        retention_days: res.data.retention_days,
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
        retention_days: policy.retention_days,
        action: policy.action,
        is_active: policy.is_active,
      });

      alert("Retention policy updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update retention policy.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="retention-loading">Loading...</div>;
  }

  return (
    <div className="retention-page">
      <div className="retention-card">
        <h2>Retention Policy</h2>

        <div className="setting-row">
          <label>Automatic Cleanup</label>

          <input
            type="checkbox"
            checked={policy.is_active}
            onChange={(e) =>
              setPolicy({
                ...policy,
                is_active: e.target.checked,
              })
            }
          />
        </div>

        <div className="setting-row">
          <label>Retention Days</label>

          <input
            type="number"
            min="1"
            value={policy.retention_days}
            onChange={(e) =>
              setPolicy({
                ...policy,
                retention_days: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="setting-row">
          <label>Action</label>

          <select
            value={policy.action}
            onChange={(e) =>
              setPolicy({
                ...policy,
                action: e.target.value,
              })
            }
          >
            <option value="archive">Archive</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        <button
          className="save-policy-btn"
          onClick={savePolicy}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Policy"}
        </button>
      </div>
    </div>
  );
}

export default RetentionPolicy;