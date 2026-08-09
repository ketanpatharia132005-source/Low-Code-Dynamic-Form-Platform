import {
  FiMove,
  FiGitBranch,
  FiGlobe,
  FiBarChart2,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { useLandingTranslation } from "../../hooks/useTranslations";



function Features() {
  const { lt } = useLandingTranslation();

  

  const features = [
    {
      icon: <FiMove />,
      title: lt("features.cards.dragDrop.title"),
      description: lt("features.cards.dragDrop.description"),
    },
    {
      icon: <FiGitBranch />,
      title: lt("features.cards.conditional.title"),
      description: lt("features.cards.conditional.description"),
    },
    {
      icon: <FiGlobe />,
      title: lt("features.cards.multilingual.title"),
      description: lt("features.cards.multilingual.description"),
    },
    {
      icon: <FiBarChart2 />,
      title: lt("features.cards.analytics.title"),
      description: lt("features.cards.analytics.description"),
    },
    {
      icon: <FiClock />,
      title: lt("features.cards.version.title"),
      description: lt("features.cards.version.description"),
    },
    {
      icon: <FiShield />,
      title: lt("features.cards.security.title"),
      description: lt("features.cards.security.description"),
    },
  ];
  return (
    <section className="features-section" id="features">

      <div className="section-heading">

        <span className="section-badge">
          {lt("features.badge")}
        </span>

        <h2>
          {lt("features.title")}
          <span> {lt("features.titleHighlight")}</span>
        </h2>

        <p>
          {lt("features.description")}
        </p>

      </div>

      <div className="features-grid">

        {features.map((feature, index) => (
          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
}


export default Features;