"""Backend runtime models and static model metadata."""

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass(slots=True)
class ModelBundle:
    """Objects loaded once at application startup."""

    model: Any
    pipeline: Any
    explainer: Any
    feature_names: list[str]


MODEL_METADATA = {
    "model_name": "Employee Attrition Tuned XGBoost",
    "algorithm": "XGBoost Classifier",
    "training_accuracy": 0.8299319727891157,
    "roc_auc": None,
    "pr_auc": None,
    "precision": 0.47,
    "recall": 0.49,
    "f1_score": 0.48,
    "number_of_features": 53,
}


def artifact_timestamp(path: Path) -> str | None:
    """Return an ISO timestamp for a model artifact, if available."""

    if not path.exists():
        return None

    modified_at = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
    return modified_at.isoformat()
