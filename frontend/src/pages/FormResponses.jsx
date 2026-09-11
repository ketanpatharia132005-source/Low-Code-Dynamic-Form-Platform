import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  browseResponses,
  getResponseDetail,
  exportResponsesCSV,
  exportResponsesJSON,
  bulkDeleteResponses,
} from "../api/api";
import "./FormResponses.css";

function FormResponses() {
  const { formId } = useParams();
  const { t } = useTranslation();
  const [responses, setResponses] = useState([]);
  const [selectedResponses, setSelectedResponses] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [fieldId, setFieldId] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const [availableFields, setAvailableFields] = useState([]);

  const [offset, setOffset] = useState(0);
  const limit = 10;

  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadResponses();
  }, [formId, search, fromDate, toDate, offset ]);

  const loadResponses = async () => {
    try {
      setLoading(true);

      const res = await browseResponses(formId, {
        search,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        field_id: fieldId || undefined,
        field_value: fieldValue || undefined,
        limit,
        offset,
      });

      setResponses(res.data.responses);
      setTotalResponses(res.data.total);
      setAvailableFields(res.data.available_fields || []);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const toggleResponse = (responseId) => {
    setSelectedResponses((prev) =>
      prev.includes(responseId)
        ? prev.filter((id) => id !== responseId)
        : [...prev, responseId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedResponses.length === responses.length) {
      setSelectedResponses([]);
    } else {
      setSelectedResponses(
        responses.map((response) => response.response_id)
      );
    }
  };

  const handleBulkDelete = () => {
    if (selectedResponses.length === 0) {
      alert(t("submissions.selectResponse"));
      return;
    }

    setShowDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setDeleting(true);

      await bulkDeleteResponses(formId, selectedResponses);

      setSelectedResponses([]);
      setShowDeleteModal(false);

      await loadResponses();

      alert(t("submissions.deleteSuccess"));
    } catch (err) {
      console.error(err);
      alert(t("submissions.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  };

    

  const previousPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const nextPage = () => {
    if (offset + limit < totalResponses) {
      setOffset(offset + limit);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  
  const handleExportCSV = async () => {
    try {
      setExporting(true);

      const res = await exportResponsesCSV(formId);

      downloadFile(res.data, `form_${formId}_responses.csv`);
    } catch (err) {
      console.error(err);
      alert(t("submissions.exportFailedCSV"));
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setExporting(true);

      const res = await exportResponsesJSON(formId);

      downloadFile(res.data, `form_${formId}_responses.json`);
    } catch (err) {
      console.error(err);
      alert(t("submissions.exportFailedJSON"));
    } finally {
      setExporting(false);
    }
  };

  
  // Detect if a value looks like an uploaded file
  const isFileValue = (value) => {
    if (typeof value !== "string") return false;

    const trimmed = value.trim().toLowerCase();

  console.log("Exporting:", exporting);

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
  console.log("Deleting =", deleting);
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="responses-header">
          <div>
            <h1>{t("submissions.title")}</h1>
            <p>{t("submissions.subtitle")}</p>
          </div>

          <div className="responses-header-actions">
            <div className="responses-count">
              <span>{t("submissions.totalSubmissions")}</span>
              <h2>{totalResponses}</h2>
            </div>

            <button
              className="delete-btn"
              onClick={handleBulkDelete}
              disabled={selectedResponses.length === 0}
            >
              🗑 {t("submissions.deleteSelected")} ({selectedResponses.length})
            </button>

            <button
               className="export-btn csv-btn"
               onClick={handleExportCSV}
               disabled ={exporting}
            >
              {exporting
                ? t("submissions.exporting")
                : t("submissions.exportCSV")}
            </button>

            <button
              className="export-btn json-btn"
              onClick={handleExportJSON}
              disabled={exporting}
            >
              {exporting
                ? t("submissions.exporting")
                : t("submissions.exportJSON")}
            </button>
          </div>
        </div>

        <div className="responses-filters">

          <div className="filter-group search-filter">
            <label>{t("submissions.search")}</label>

            <input
              type="text"
              placeholder={t("submissions.searchPlaceholder")}
              value={search}
              onChange={(e) => {
                setOffset(0);
                setSearch(e.target.value);
              }}
              className="filter-input"
            />
          </div>


          <div className="filter-group">
            <label>{t("submissions.field")}</label>

            <select
              value={fieldId}
              onChange={(e) => {
                setOffset(0);
                setFieldId(e.target.value);
              }}
              className="filter-input"
            >
              <option value="">{t("submissions.allFields")}</option>

              {availableFields.map((field) => (
                <option
                  key={field.id}
                  value={field.id}
                >
                  {field.label}
                </option>
              ))}
            </select>
          </div>


          <div className="filter-group">
            <label>{t("submissions.value")}</label>
            <input
              type="text"
              placeholder={t("submissions.fieldValue")}
              value={fieldValue}
              onChange={(e) => {
                setOffset(0);
                setFieldValue(e.target.value);
              }}
              className="filter-input"
            />
          </div>


          <div className="filter-group date-filter">
            <label>{t("submissions.fromDate")}</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setOffset(0);
                setFromDate(e.target.value);
              }}
              className="filter-input"
            />
          </div>


          <div className="filter-group date-filter">
            <label>{t("submissions.toDate")}</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setOffset(0);
                setToDate(e.target.value);
              }}
              className="filter-input"
            />
          </div>


          <div className="filter-actions">
            <button
              className="page-btn"
              onClick={() => {
                setSearch("");
                setFieldId("");
                setFieldValue("");
                setFromDate("");
                setToDate("");
                setOffset(0);
              }}
            >
             {t("submissions.reset")}
            </button>
          </div>

        </div>

        {loading ? (
          <div className="responses-empty">
            <h3>{t("submissions.loading")}</h3>
            <p>{t("submissions.loadingDescription")}</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="responses-empty">
            <h3>{t("submissions.noResponsesYet")}</h3>
            <p>{t("submissions.noResponsesYetDescription")}</p>
          </div>
        ) : (
          <div className="responses-table">
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        responses.length > 0 &&
                        selectedResponses.length === responses.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>

                  <th>{t("submissions.responseId")}</th>
                  <th>{t("submissions.submittedAt")}</th>
                  <th>{t("submissions.summary")}</th>
                  <th>{t("submissions.action")}</th>
                </tr>
              </thead>

              <tbody>
                {responses.map((response) => (
                  <tr key={response.response_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedResponses.includes(response.response_id)}
                        onChange={() => toggleResponse(response.response_id)}
                      />
                    </td>
                    <td>{response.response_id}</td>

                    <td>
                      {new Date(response.created_at).toLocaleString()}
                    </td>

                    <td>
                      {Object.entries(response.summary).map(([key, value]) => (
                        <div className="response-item" key={key}>
                          <span className="response-label">{key}</span>

                          <span className="response-value">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </td>

                    <td>
                      <button
                        className="table-btn edit"
                        onClick={async () => {
                          console.log("View Clicked")


                          try {
                            const res = await getResponseDetail(
                              formId,
                              response.response_id
                            );

                            console.log("Response Detail:", res.data);

                            setSelectedResponse(res.data);
                            setShowModal(true);
                          } catch (err) {
                            console.error(err);
                            alert(t("submissions.loadResponseFailed"));
                          }
                        }}
                      >
                        {t("submissions.viewResponse")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {responses.length > 0 && (
          <div className="responses-pagination">
            <button
              className="page-btn"
              onClick={previousPage}
              disabled={offset === 0}
            >
              {t("submissions.previous")}
            </button>

            <span className="page-info">
              {t("submissions.page")} {Math.floor(offset / limit) + 1}{" "}
              {t("submissions.of")}{" "}
              {Math.max(1, Math.ceil(totalResponses / limit))}
            </span>

            <button
              className="page-btn"
              onClick={nextPage}
              disabled={offset + limit >= totalResponses}
            >
              {t("submissions.next")}
          </button>
        </div>
      )}
      </div>
       {showModal && selectedResponse && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="response-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{t("submissions.responseDetails")}</h2>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="response-meta">
              <p>
                <strong>{t("submissions.responseId")}:</strong>{" "}
                {selectedResponse.response_id}
              </p>

              <p>
                <strong>{t("submissions.submittedAt")}:</strong>{" "}
                {new Date(
                  selectedResponse.created_at
                ).toLocaleString()}
              </p>
            </div>

            <div className="response-details">
              {selectedResponse.responses.map((field) => (
                <div
                  className="response-detail-row"
                  key={field.field_id}
                >
                  <div className="response-detail-label">
                    {field.field_label}
                  </div>

                  <div className="response-detail-value">
                    {Array.isArray(field.value)
                      ? field.value.join(", ")
                      : String(field.value ?? "")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="response-modal"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="modal-header">
            <h2>{t("submissions.deleteResponses")}</h2>

            <button
              className="close-btn"
              onClick={() => setShowDeleteModal(false)}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              padding: "20px",
            }}
          >
            <p>
              {t("submissions.deleteConfirmation")}
              <strong> {selectedResponses.length} </strong>
              {t("submissions.responsesCount")}
            </p>

            <p
              style={{
                color: "#dc2626",
                marginTop: "12px",
                fontWeight: "600",
              }}
            >
              {t("submissions.cannotBeUndone")}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "25px",
              }}
            >
              <button
                className="page-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                {t("submissions.cancel")}
              </button>

              <button
                className="delete-btn"
                onClick={confirmBulkDelete}
                disabled={deleting}
              >
                {deleting
                  ? t("submissions.deleting")
                  : t("submissions.deletePermanently")}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </Layout>
    

  );
}

export default FormResponses;