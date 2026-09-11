import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/api";
import Layout from "../components/layout/Layout";
import "./AuditLog.css";

function AuditLog() {
  const { t } = useTranslation();
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
      alert(t("auditLogs.loadFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="audit-loading">
        {t("auditLogs.loading")}
      </div>
    );
  }

  return (
    <Layout>
    <div className="audit-page">
      <div className="audit-card">
        <div className="audit-header">
          <h2>{t("auditLogs.title")}</h2>
          <p>{t("auditLogs.subtitle")}</p>
        </div>

        {logs.length === 0 ? (
          <div className="audit-empty">
             {t("auditLogs.empty")}
          </div>
        ) : (
          <table className="audit-table">
            <thead>
              <tr>
                <th>{t("auditLogs.id")}</th>
                <th>{t("auditLogs.action")}</th>
                <th>{t("auditLogs.entity")}</th>
                <th>{t("auditLogs.records")}</th>
                <th>{t("auditLogs.createdAt")}</th>
                <th>{t("auditLogs.details")}</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>

                  <td>
                    <span className="audit-action">
                      {t(`auditLogs.actions.${log.action}`, {
                        defaultValue: log.action,
                      })}
                    </span>
                  </td>

                  <td>
                    {t(`auditLogs.entities.${log.entity_type}`, {
                      defaultValue: log.entity_type,
                    })}
                  </td>

                  <td>{log.records_affected}</td>

                  <td>
                    {new Date(log.created_at).toLocaleString()}
                  </td>

                  <td>
                    <div className="audit-details">
                      {log.details?.form_id && (
                        <div>
                          <strong>{t("auditLogs.form")}:</strong> {log.details.form_id}
                        </div>
                      )}

                      {log.details?.response_ids && (
                        <div>
                          <strong>{t("auditLogs.responses")}:</strong>{" "}
                          {log.details.response_ids.length}
                        </div>
                      )}

                      {log.details?.retention_job && (
                        <div>{t("auditLogs.automaticRetentionJob")}</div>
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