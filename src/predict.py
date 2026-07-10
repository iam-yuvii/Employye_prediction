"""Prediction-only functionality for saved attrition artifacts."""

from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from src.config import (
    HIGH_RISK_LABEL,
    LOW_RISK_LABEL,
    MODEL_INPUT_COLUMNS,
    MODEL_PATH,
    PIPELINE_PATH,
    RAW_PREDICTION_COLUMNS,
)
from src.feature_engineering import add_engineered_features
from src.preprocessing import clean_data, load_pipeline


def _employee_to_dataframe(employee: dict[str, Any]) -> pd.DataFrame:
    data = pd.DataFrame([employee])

    for column in RAW_PREDICTION_COLUMNS:
        if column not in data.columns:
            data[column] = np.nan

    data = clean_data(data)
    data = add_engineered_features(data)

    for column in MODEL_INPUT_COLUMNS:
        if column not in data.columns:
            data[column] = np.nan

    return data[MODEL_INPUT_COLUMNS]


def _positive_class_probability(model: Any, transformed_employee: Any) -> float:
    if hasattr(model, "predict_proba"):
        return float(model.predict_proba(transformed_employee)[0, 1])

    prediction = model.predict(transformed_employee)[0]
    return float(prediction)


def predict_employee(
    employee: dict[str, Any],
    model_path: str | Path = MODEL_PATH,
    pipeline_path: str | Path = PIPELINE_PATH,
    threshold: float = 0.5,
) -> dict[str, float | str]:
    """Predict attrition risk for one employee dictionary."""

    employee_frame = _employee_to_dataframe(employee)
    pipeline = load_pipeline(pipeline_path)
    transformed_employee = pipeline.transform(employee_frame)

    model = joblib.load(Path(model_path))
    probability = _positive_class_probability(model, transformed_employee)
    label = HIGH_RISK_LABEL if probability >= threshold else LOW_RISK_LABEL

    return {
        "prediction": label,
        "probability": round(probability, 4),
    }
