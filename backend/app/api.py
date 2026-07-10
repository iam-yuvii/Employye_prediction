"""API router definitions."""

import logging

from fastapi import APIRouter, Depends, Request

from .models import ModelBundle
from .schemas import (
    EmployeeRequest,
    ExplanationResponse,
    HealthResponse,
    ModelInfoResponse,
    PredictionResponse,
    RootResponse,
)
from .services import model_info, predict_attrition
from .shap_service import explain_prediction

logger = logging.getLogger(__name__)

router = APIRouter()


def get_model_bundle(request: Request) -> ModelBundle:
    """Resolve the startup-loaded model bundle from application state."""

    return request.app.state.model_bundle


@router.get("/", response_model=RootResponse)
def root() -> RootResponse:
    """Return API project status."""

    return RootResponse(
        project="Employee Attrition Prediction API",
        status="Running",
    )


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Return a lightweight health check."""

    return HealthResponse(status="healthy")


@router.post("/predict", response_model=PredictionResponse)
def predict(
    employee: EmployeeRequest,
    bundle: ModelBundle = Depends(get_model_bundle),
) -> dict[str, float | str]:
    """Predict employee attrition risk."""

    logger.info("Prediction request received")
    return predict_attrition(bundle, employee)


@router.post("/explain", response_model=ExplanationResponse)
def explain(
    employee: EmployeeRequest,
    bundle: ModelBundle = Depends(get_model_bundle),
) -> dict[str, object]:
    """Explain one employee attrition prediction with SHAP values."""

    logger.info("Explanation request received")
    return explain_prediction(bundle, employee)


@router.get("/model-info", response_model=ModelInfoResponse)
def get_model_info() -> dict[str, object]:
    """Return model metadata."""

    return model_info()
