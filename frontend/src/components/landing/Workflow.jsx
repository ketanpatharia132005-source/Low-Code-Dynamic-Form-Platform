import { FiEdit3, FiShare2, FiBarChart2 } from "react-icons/fi";
import { useLandingTranslation } from "../../hooks/useTranslations";



function Workflow() {
  const { lt } = useLandingTranslation();

  const steps = [
    {
      number: "01",
      icon: <FiEdit3 />,
      title: lt("workflow.steps.create.title"),
      description: lt("workflow.steps.create.description"),
    },
    {
      number: "02",
      icon: <FiShare2 />,
      title: lt("workflow.steps.publish.title"),
      description: lt("workflow.steps.publish.description"),
    },
    {
      number: "03",
      icon: <FiBarChart2 />,
      title: lt("workflow.steps.analyze.title"),
      description: lt("workflow.steps.analyze.description"),
    },
  ];
  return (
    <section className="workflow-section" id="workflow">

      <div className="section-heading">

        <span className="section-badge">
          {lt("workflow.badge")}
        </span>

        <h2>
          {lt("workflow.title")}
          <span> {lt("workflow.titleHighlight")}</span>
        </h2>

        <p>
          {lt("workflow.description")}
        </p>

      </div>

      <div className="workflow-container">

        {steps.map((step, index) => (
          <div className="workflow-card" key={index}>

            <div className="step-number">
              {step.number}
            </div>

            <div className="workflow-icon">
              {step.icon}
            </div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Workflow;