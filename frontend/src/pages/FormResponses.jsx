import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { getFormSubmissions } from "../api/api";
import "./FormResponses.css";

function FormResponses() {
  const { formId } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, [formId]);

  const loadResponses = async () => {
    try {
      const res = await getFormSubmissions(formId);
      console.log("API RESPONSE:", res.data);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  // Detect if a value looks like an uploaded file
  const isFileValue = (value) => {
    if (typeof value !== "string") return false;

    const trimmed = value.trim().toLowerCase();

    return [
      ".pdf",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".webp",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".csv",
      ".txt",
      ".zip",
    ].some((ext) => trimmed.endsWith(ext));
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="responses-header">
          <div>
            <h1>Form Responses</h1>
            <p>View every submission received for this form.</p>
          </div>

          <div className="responses-count">
            <span>Total Responses</span>
            <h2>{submissions.length}</h2>
          </div>
        </div>

        {loading ? (
          <div className="responses-empty">
            <h3>Loading responses...</h3>
            <p>Please wait while I fetch the submissions.</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="responses-empty">
            <h3>No Responses Yet</h3>
            <p>This form hasn't received any submissions yet.</p>
          </div>
        ) : (
          <div className="responses-table">
            <table>
              <thead>
                <tr>
                  <th>Submission ID</th>
                  <th>Submitted At</th>
                  <th>Responses</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>#{submission.id}</td>

                    <td>
                      {new Date(submission.created_at).toLocaleString()}
                    </td>

                    <td>
                      {submission.submitted_data.map((item, index) => (
                        <div className="response-item" key={index}>
                          <span className="response-label">
                            {item.field_label}
                          </span>

                          <span className="response-value">
                            {Array.isArray(item.value) ? (
                              item.value.join(", ")
                            ) : isFileValue(item.value) ? (
                              <a
                                href={`http://localhost:8001/api/v1/files/${item.value}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="file-download-link"
                              >
                                📄 {item.display_name || "Download File"} 
                              </a>
                            ) : (
                              item.value
                            )}
                          </span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default FormResponses;