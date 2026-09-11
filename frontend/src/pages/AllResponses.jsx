import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Search, ArrowLeft } from "lucide-react";

import Layout from "../components/layout/Layout";
import { browseAllResponses } from "../api/api";
import "./AllResponses.css";
import { useTranslation } from "react-i18next";

function AllResponses() {
  const { t: lt } = useTranslation();
  const navigate = useNavigate();

  const [responses, setResponses] = useState([]);
  const [totalResponses, setTotalResponses] = useState(0);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [offset, setOffset] = useState(0);
  const limit = 10;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, [search, fromDate, toDate, offset]);

  const loadResponses = async () => {
    try {
      setLoading(true);

      const res = await browseAllResponses({
        search,
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        limit,
        offset,
      });

      setResponses(res.data.responses || []);
      setTotalResponses(res.data.total || 0);
    } catch (err) {
      console.error("Failed to load all responses:", err);
    } finally {
      setLoading(false);
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

  const resetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setOffset(0);
  };

  return (
    <Layout>
      <div className="all-responses-page">

        {/* Header */}

        <div className="all-responses-header">

          <div>
            <h1>{lt("submissions.title")}</h1>

<p>
 <p>{lt("submissions.subtitle")}</p>
</p>
          </div>

          <div className="all-responses-count">
            <span>{lt("submissions.totalSubmissions")}</span>
            <strong>{totalResponses}</strong>
          </div>

        </div>


        {/* Filters */}

        <div className="all-responses-filters">

          <div className="all-response-filter">
            <label>{lt("submissions.search")}</label>

            <div className="all-response-search">
              <Search size={16} />

              <input
                type="text"
                placeholder={lt("submissions.searchPlaceholder")}
                value={search}
                onChange={(e) => {
                  setOffset(0);
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>


          <div className="all-response-filter">
            <label>{lt("submissions.fromDate")}</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setOffset(0);
                setFromDate(e.target.value);
              }}
            />
          </div>


          <div className="all-response-filter">
            <label>{lt("submissions.toDate")}</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setOffset(0);
                setToDate(e.target.value);
              }}
            />
          </div>


          <button
            className="all-response-reset"
            onClick={resetFilters}
          >
            {lt("submissions.reset")}
          </button>

        </div>


        {/* Table */}

        {loading ? (

          <div className="all-responses-empty">
            <h3>{lt("submissions.loading")}</h3>
            <p>
              {lt("submissions.loadingDescription")}
            </p>
          </div>

        ) : responses.length === 0 ? (

          <div className="all-responses-empty">
            <h3>{lt("submissions.noResponses")}</h3>
            <p>
              {lt("submissions.noResponsesDescription")}
            </p>
          </div>

        ) : (

          <div className="all-responses-table">

            <table>

              <thead>

                <tr>
                  <th>{lt("submissions.form")}</th>
                  <th>{lt("submissions.responseId")}</th>
                  <th>{lt("submissions.submittedAt")}</th>
                  <th>{lt("submissions.summary")}</th>
                  <th>{lt("submissions.action")}</th>
                </tr>

              </thead>


              <tbody>

                {responses.map((response) => (

                  <tr key={response.response_id}>

                    <td>
                      <span className="all-response-form">
                        Form #{response.form_id}
                      </span>
                    </td>


                    <td>
                      <span className="all-response-id">
                        {response.response_id}
                      </span>
                    </td>


                    <td>
                      {new Date(
                        response.created_at
                      ).toLocaleString()}
                    </td>


                    <td>

                      <div className="all-response-summary">

                        {Object.entries(
                          response.summary || {}
                        ).map(([key, value]) => (

                          <div
                            className="all-response-summary-item"
                            key={key}
                          >
                            <span>{key}</span>

                            <strong>
                              {String(value)}
                            </strong>
                          </div>

                        ))}

                      </div>

                    </td>


                    <td>

                      <button
                        className="all-response-view"
                        onClick={() =>
                          navigate(
                            `/responses/${response.form_id}`
                          )
                        }
                      >
                        <Eye size={15} />
                        {lt("submissions.viewForm")}
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


        {/* Pagination */}

        {responses.length > 0 && (

          <div className="all-responses-pagination">

            <button
              onClick={previousPage}
              disabled={offset === 0}
            >
              <ArrowLeft size={15} />
              {lt("submissions.previous")}
            </button>


            <span>
               {lt("submissions.page")}{" "}
              {Math.floor(offset / limit) + 1}
              {" "}{lt("submissions.of")}{" "}
              {Math.max(
                1,
                Math.ceil(totalResponses / limit)
              )}
            </span>


            <button
              onClick={nextPage}
              disabled={
                offset + limit >= totalResponses
              }
            >
             {lt("submissions.next")}
            </button>

          </div>

        )}

      </div>
    </Layout>
  );
}

export default AllResponses;