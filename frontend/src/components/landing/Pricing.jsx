import { FiCheck, FiStar } from "react-icons/fi";
import { useLandingTranslation } from "../../hooks/useTranslations";


function Pricing() {

  const { lt } = useLandingTranslation();

  const plans = [
    {
      title: lt("pricing.plans.starter.title"),
      badge: lt("pricing.plans.starter.badge"),
      featured: false,
      features: [
        lt("pricing.plans.starter.features.0"),
        lt("pricing.plans.starter.features.1"),
        lt("pricing.plans.starter.features.2"),
        lt("pricing.plans.starter.features.3"),
        lt("pricing.plans.starter.features.4"),
      ],
    },
    {
      title: lt("pricing.plans.professional.title"),
      badge: lt("pricing.plans.professional.badge"),
      featured: true,
      features: [
        lt("pricing.plans.professional.features.0"),
        lt("pricing.plans.professional.features.1"),
        lt("pricing.plans.professional.features.2"),
        lt("pricing.plans.professional.features.3"),
        lt("pricing.plans.professional.features.4"),
        lt("pricing.plans.professional.features.5"),
      ],
    },
    {
      title: lt("pricing.plans.enterprise.title"),
      badge: lt("pricing.plans.enterprise.badge"),
      featured: false,
      features: [
        lt("pricing.plans.enterprise.features.0"),
        lt("pricing.plans.enterprise.features.1"),
        lt("pricing.plans.enterprise.features.2"),
        lt("pricing.plans.enterprise.features.3"),
        lt("pricing.plans.enterprise.features.4"),
        lt("pricing.plans.enterprise.features.5"),
      ],
    },
  ];
  return (
    <section className="pricing-section" id="pricing">

      <div className="section-heading">

        <span className="section-badge">
          {lt("pricing.badge")}
        </span>

        <h2>
          {lt("pricing.title")}
          <span> {lt("pricing.titleHighlight")}</span>
        </h2>

        <p>
          {lt("pricing.description")}
        </p>

      </div>

      <div className="pricing-grid">

        {plans.map((plan, index) => (
          <div
            className={`pricing-card ${plan.featured ? "featured-plan" : ""}`}
            key={index}
          >

            {plan.featured && (
              <div className="popular-badge">
                <FiStar />
               {lt("pricing.mostRequested")}
              </div>
            )}

            <span className="plan-badge">
              {plan.badge}
            </span>

            <h3>{plan.title}</h3>

            <ul>

              {plan.features.map((feature, i) => (
                <li key={i}>
                  <FiCheck />
                  {feature}
                </li>
              ))}

            </ul>

            <button className="plan-btn">
              {lt("pricing.learnMore")}
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}

export default Pricing;