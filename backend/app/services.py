"""Business logic for model loading and prediction."""

import logging
from typing import Any

import numpy as np
import pandas as pd

from .models import MODEL_METADATA, ModelBundle, artifact_timestamp
from .schemas import EmployeeRequest
from .utils import (
    MODEL_PATH,
    PIPELINE_PATH,
    configure_project_path,
    load_joblib,
    patch_column_transformer_compatibility,
    risk_level,
)

configure_project_path()

from src.feature_engineering import add_engineered_features  # noqa: E402
from src.preprocessing import clean_data  # noqa: E402

logger = logging.getLogger(__name__)


MODEL_INPUT_COLUMNS = [
    "Age",
    "BusinessTravel",
    "DailyRate",
    "Department",
    "DistanceFromHome",
    "Education",
    "EducationField",
    "EnvironmentSatisfaction",
    "Gender",
    "HourlyRate",
    "JobInvolvement",
    "JobLevel",
    "JobRole",
    "JobSatisfaction",
    "MaritalStatus",
    "MonthlyIncome",
    "MonthlyRate",
    "NumCompaniesWorked",
    "OverTime",
    "PercentSalaryHike",
    "PerformanceRating",
    "RelationshipSatisfaction",
    "StockOptionLevel",
    "TotalWorkingYears",
    "TrainingTimesLastYear",
    "WorkLifeBalance",
    "YearsAtCompany",
    "YearsInCurrentRole",
    "YearsSinceLastPromotion",
    "YearsWithCurrManager",
    "TenureRatio",
    "PromotionGap",
    "IncomeLevelRatio",
]


def create_model_bundle() -> ModelBundle:
    """Load the pipeline, trained model, and SHAP explainer once."""

    logger.info("Loading preprocessing pipeline from %s", PIPELINE_PATH)
    pipeline = patch_column_transformer_compatibility(load_joblib(PIPELINE_PATH))

    logger.info("Loading trained model from %s", MODEL_PATH)
    model = load_joblib(MODEL_PATH)

    import shap

    logger.info("Creating SHAP explainer")
    explainer = shap.Explainer(model)

    feature_names = list(pipeline.get_feature_names_out())
    logger.info("Model bundle loaded with %s transformed features", len(feature_names))

    return ModelBundle(
        model=model,
        pipeline=pipeline,
        explainer=explainer,
        feature_names=feature_names,
    )


def employee_to_dataframe(employee: EmployeeRequest) -> pd.DataFrame:
    """Convert a validated employee payload into model-ready raw columns."""

    raw_frame = pd.DataFrame([employee.to_original_feature_dict()])
    cleaned = clean_data(raw_frame)
    engineered = add_engineered_features(cleaned)
    return engineered[MODEL_INPUT_COLUMNS]


def transform_employee(bundle: ModelBundle, employee: EmployeeRequest) -> Any:
    """Apply the saved preprocessing pipeline to one employee."""

    employee_frame = employee_to_dataframe(employee)
    return bundle.pipeline.transform(employee_frame)


def predict_attrition(
    bundle: ModelBundle,
    employee: EmployeeRequest,
    threshold: float = 0.5,
) -> dict[str, float | str]:
    """Predict attrition probability and risk label for one employee."""

    transformed_employee = transform_employee(bundle, employee)
    probability = float(bundle.model.predict_proba(transformed_employee)[0, 1])
    prediction = "High Risk" if probability >= threshold else "Low Risk"

    return {
        "prediction": prediction,
        "probability": round(probability, 4),
        "risk_level": risk_level(probability),
    }


def model_info() -> dict[str, Any]:
    """Return model metadata exposed by the API."""

    return {
        **MODEL_METADATA,
        "training_date": artifact_timestamp(MODEL_PATH),
    }
