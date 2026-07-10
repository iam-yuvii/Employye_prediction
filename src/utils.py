"""General utility helpers for persistence and validation."""

from pathlib import Path
from typing import Any, Iterable

import joblib
import numpy as np
import pandas as pd


def ensure_directory(path: str | Path) -> Path:
    """Create a directory if it does not already exist."""

    directory = Path(path)
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def save_joblib_artifact(artifact: Any, path: str | Path) -> Path:
    """Persist an object with joblib and return the saved path."""

    artifact_path = Path(path)
    ensure_directory(artifact_path.parent)
    joblib.dump(artifact, artifact_path)
    return artifact_path


def load_joblib_artifact(path: str | Path) -> Any:
    """Load a joblib artifact from disk."""

    return joblib.load(Path(path))


def missing_columns(data: pd.DataFrame, columns: Iterable[str]) -> list[str]:
    """Return required columns that are missing from a dataframe."""

    return [column for column in columns if column not in data.columns]


def set_random_seed(seed: int) -> None:
    """Set NumPy's random seed for reproducible local operations."""

    np.random.seed(seed)
