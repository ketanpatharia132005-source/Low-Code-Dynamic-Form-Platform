import { Link, useParams } from "react-router-dom";

import Layout from "../components/layout/Layout";
import BuilderLayout from "../components/builder/BuilderLayout";

function FormBuilder() {
  const { formId } = useParams();

  return (
    <Layout>
      {formId ? (
        <BuilderLayout formId={Number(formId)} />
      ) : (
        <div style={{ padding: 20, textAlign: "left" }}>
          <h1>Choose a Form</h1>
          <p>Create or reopen a form from the dashboard.</p>
          <Link to="/dashboard">Go to Dashboard</Link>
        </div>
      )}
    </Layout>
  );
}

export default FormBuilder;
