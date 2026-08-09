import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/layout/Layout";
import "./AuditLog.css";

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const res = await api.get("/audit");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="audit-loading">
        Loading audit logs...
      </div>
    );
  }

  return (
    <Layout>
    <div className="audit-page">
      <div className="audit-card">
        <div className="audit-header">
          <h2>Audit Logs</h2>
          <p>Track system activities and administrative actions.</p>
        </div>

        {logs.length === 0 ? (
          <div className="audit-empty">
            No audit logs found.
          </div>
        ) : (
          <table className="audit-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Records</th>
                <th>Created At</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>

                  <td>
                    <span className="audit-action">
                      {log.action}
                    </span>
                  </td>

                  <td>{log.entity_type}</td>

                  <td>{log.records_affected}</td>

                  <td>
                    {new Date(log.created_at).toLocaleString()}
                  </td>

                  <td>
                    <div className="audit-details">
                      {log.details?.form_id && (
                        <div><strong>Form:</strong> {log.details.form_id}</div>
                      )}

                      {log.details?.response_ids && (
                        <div>
                          <strong>Responses:</strong> {log.details.response_ids.length}
                        </div>
                      )}

                      {log.details?.retention_job && (
                        <div>Automatic Retention Job</div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
   </Layout>
  );
}

export default AuditLog;