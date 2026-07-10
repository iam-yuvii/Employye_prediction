"""SHAP explanation service for structured API responses."""

from .models import ModelBundle
from .schemas import EmployeeRequest
from .services import predict_attrition, transform_employee


def _business_recommendations(
    employee: EmployeeRequest,
    positive_features: list[dict[str, float | str]],
) -> list[str]:
    recommendations: list[str] = []
    positive_names = " ".join(str(item["feature"]) for item in positive_features)

    if employee.over_time == "Yes" or "OverTime" in positive_names:
        recommendations.append(
            "Review workload and overtime expectations with the employee within the next two weeks."
        )
    if employee.job_satisfaction <= 2 or employee.environment_satisfaction <= 2:
        recommendations.append(
            "Schedule a manager check-in focused on satisfaction, team fit, and blockers."
        )
    if employee.years_since_last_promotion >= 3 or "PromotionGap" in positive_names:
        recommendations.append(
            "Assess promotion readiness, internal mobility options, and growth-path clarity."
        )
    if employee.stock_option_level == 0 or employee.monthly_income < 4000:
        recommendations.append(
            "Benchmark compensation and retention incentives against similar roles."
        )
    if employee.work_life_balance <= 2:
        recommendations.append(
            "Offer flexibility or workload rebalancing to improve work-life balance."
        )

    if not recommendations:
        recommendations.append(
            "Maintain engagement through regular feedback, recognition, and career development conversations."
        )

    return recommendations[:4]


def _extract_single_shap_values(shap_values: object) -> list[float]:
    values = getattr(shap_values, "values", shap_values)

    if len(values.shape) == 3:
        return [float(value) for value in values[0, :, 1]]

    return [float(value) for value in values[0]]


def explain_prediction(
    bundle: ModelBundle,
    employee: EmployeeRequest,
    top_n: int = 5,
) -> dict[str, object]:
    """Return prediction and top positive/negative SHAP contributors."""

    transformed_employee = transform_employee(bundle, employee)
    shap_values = bundle.explainer(transformed_employee)
    impacts = _extract_single_shap_values(shap_values)

    feature_impacts = [
        {
            "feature": feature,
            "impact": round(impact, 6),
        }
        for feature, impact in zip(bundle.feature_names, impacts)
    ]

    positive_features = sorted(
        [item for item in feature_impacts if item["impact"] > 0],
        key=lambda item: item["impact"],
        reverse=True,
    )[:top_n]
    negative_features = sorted(
        [item for item in feature_impacts if item["impact"] < 0],
        key=lambda item: item["impact"],
    )[:top_n]

    return {
        **predict_attrition(bundle, employee),
        "positive_features": positive_features,
        "negative_features": negative_features,
        "shap_values": feature_impacts,
        "business_recommendations": _business_recommendations(
            employee,
            positive_features,
        ),
    }
