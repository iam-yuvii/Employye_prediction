"""SHAP explainability helpers for the attrition model."""

from typing import Any

import numpy as np
import pandas as pd

from src.config import MODEL_INPUT_COLUMNS
from src.feature_engineering import add_engineered_features
from src.preprocessing import clean_data


def _load_shap() -> Any:
    import shap

    return shap


def create_explainer(model: Any) -> Any:
    """Create a SHAP explainer for a fitted model."""

    shap = _load_shap()
    return shap.Explainer(model)


def _prepare_dataframe_for_pipeline(data: pd.DataFrame, pipeline: Any) -> Any:
    prepared = add_engineered_features(clean_data(data))

    for column in MODEL_INPUT_COLUMNS:
        if column not in prepared.columns:
            prepared[column] = np.nan

    return pipeline.transform(prepared[MODEL_INPUT_COLUMNS])


def _prepare_explanation_data(
    data: Any | None = None,
    employee_index: int | None = None,
    employee_dataframe: pd.DataFrame | None = None,
    pipeline: Any | None = None,
) -> Any:
    if employee_dataframe is not None:
        selected_data = employee_dataframe
    else:
        if data is None:
            raise ValueError("Provide either data or employee_dataframe.")

        if employee_index is None:
            selected_data = data
        elif isinstance(data, pd.DataFrame):
            selected_data = data.iloc[[employee_index]]
        else:
            selected_data = data[employee_index : employee_index + 1]

    if pipeline is not None and isinstance(selected_data, pd.DataFrame):
        return _prepare_dataframe_for_pipeline(selected_data, pipeline)

    return selected_data


def shap_summary_plot(
    explainer: Any,
    data: Any,
    pipeline: Any | None = None,
    show: bool = True,
) -> Any:
    """Create a global SHAP summary plot for raw or prepared model data."""

    shap = _load_shap()
    explanation_data = _prepare_explanation_data(data=data, pipeline=pipeline)
    shap_values = explainer(explanation_data)
    shap.summary_plot(shap_values, explanation_data, show=show)
    return shap_values


def shap_waterfall_plot(
    explainer: Any,
    data: Any | None = None,
    employee_index: int | None = None,
    employee_dataframe: pd.DataFrame | None = None,
    pipeline: Any | None = None,
) -> Any:
    """Create a SHAP waterfall plot for one employee by index or dataframe."""

    shap = _load_shap()
    employee_data = _prepare_explanation_data(
        data=data,
        employee_index=employee_index,
        employee_dataframe=employee_dataframe,
        pipeline=pipeline,
    )
    shap_values = explainer(employee_data)
    shap.plots.waterfall(shap_values[0])
    return shap_values[0]


def shap_force_plot(
    explainer: Any,
    data: Any | None = None,
    employee_index: int | None = None,
    employee_dataframe: pd.DataFrame | None = None,
    pipeline: Any | None = None,
) -> Any:
    """Create a SHAP force plot for one employee by index or dataframe."""

    shap = _load_shap()
    employee_data = _prepare_explanation_data(
        data=data,
        employee_index=employee_index,
        employee_dataframe=employee_dataframe,
        pipeline=pipeline,
    )
    shap_values = explainer(employee_data)
    return shap.plots.force(shap_values[0])
