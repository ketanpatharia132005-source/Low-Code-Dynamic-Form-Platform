import { useLocation, useNavigate } from "react-router-dom";

function SubmissionSuccess() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>No submission found.</h2>
                <button onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>
        );
    }

    const copyResponseId = async () => {
        await navigator.clipboard.writeText(state.response_id);
        alert("Response ID copied!");
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

            <h1>Thank You!</h1>

            <p>
                Your response has been submitted successfully.
            </p>

            <hr style={{ margin: "25px 0" }} />

            <h3>Response ID</h3>

            <h2
                style={{
                    color: "#2563eb",
                    wordBreak: "break-all",
                }}
            >
                {state.response_id}
            </h2>

            <p>
                Submitted At
            </p>

            <strong>
                {new Date(state.submitted_at).toLocaleString()}
            </strong>

            <hr style={{ margin: "25px 0" }} />

            <button onClick={copyResponseId}>
                Copy Response ID
            </button>

            <br />
            <br />

            <button
                onClick={() => navigate(-1)}
                style={{ marginRight: "10px" }}
            >
                Submit Another
            </button>

            <button
                onClick={() => navigate("/")}
            >
                Home
            </button>
        </div>
    );
}

export default SubmissionSuccess;