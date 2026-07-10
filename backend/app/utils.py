"""Backend utility helpers."""

import logging
import os
import sys
from pathlib import Path
from typing import Any

import joblib

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MODELS_DIR = PROJECT_ROOT / "models"
MODEL_PATH = MODELS_DIR / "tuned_xgboost.pkl"
PIPELINE_PATH = MODELS_DIR / "preprocessing_pipeline.pkl"


def configure_project_path() -> None:
    """Ensure the refactored ML package can be imported by the backend."""

    project_root = str(PROJECT_ROOT)
    if project_root not in sys.path:
        sys.path.insert(0, project_root)


def load_env_file(path: Path | None = None) -> None:
    """Load simple KEY=VALUE pairs from a local .env file if it exists."""

    env_path = path or PROJECT_ROOT / "backend" / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def setup_logging() -> None:
    """Configure application logging."""

    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=getattr(logging, log_level, logging.INFO),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )


def load_joblib(path: Path) -> Any:
    """Load a joblib artifact from disk."""

    if not path.exists():
        raise FileNotFoundError(f"Missing artifact: {path}")

    return joblib.load(path)


def patch_column_transformer_compatibility(pipeline: Any) -> Any:
    """Patch scikit-learn ColumnTransformer compatibility for older runtimes."""

    if not hasattr(pipeline, "force_int_remainder_cols"):
        pipeline.force_int_remainder_cols = False

    return pipeline


def risk_level(probability: float) -> str:
    """Map attrition probability to a coarse risk level."""

    if probability >= 0.75:
        return "High"
    if probability >= 0.5:
        return "Medium"
    return "Low"
