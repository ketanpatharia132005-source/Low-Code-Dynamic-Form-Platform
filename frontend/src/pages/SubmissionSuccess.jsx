import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SubmissionSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t: lt } = useTranslation();

  if (!state) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>{lt("submissionSuccess.noSubmission")}</h2>

        <button onClick={() => navigate("/")}>
          {lt("submissionSuccess.goHome")}
        </button>
      </div>
    );
  }

  const copyResponseId = async () => {
    await navigator.clipboard.writeText(state.response_id);
    alert(lt("submissionSuccess.responseIdCopied"));
  };

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "60px auto",
        background: "#fff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "60px" }}>✅</div>

      <h1>{lt("submissionSuccess.thankYou")}</h1>

      <p>
        {lt("submissionSuccess.submittedSuccessfully")}
      </p>

      <hr style={{ margin: "25px 0" }} />

      <h3>{lt("submissionSuccess.responseId")}</h3>

      <h2
        style={{
          color: "#2563eb",
          wordBreak: "break-all",
        }}
      >
        {state.response_id}
      </h2>

      <p>
        {lt("submissionSuccess.submittedAt")}
      </p>

      <strong>
        {new Date(state.submitted_at).toLocaleString()}
      </strong>

      <hr style={{ margin: "25px 0" }} />

      <button onClick={copyResponseId}>
        {lt("submissionSuccess.copyResponseId")}
      </button>

      <br />
      <br />

      <button
        onClick={() => navigate(-1)}
        style={{ marginRight: "10px" }}
      >
        {lt("submissionSuccess.submitAnother")}
      </button>

      <button
        onClick={() => navigate("/")}
      >
        {lt("submissionSuccess.home")}
      </button>
    </div>
  );
}

export default SubmissionSuccess;