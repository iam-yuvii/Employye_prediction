"""Data loading, cleaning, splitting, and preprocessing pipeline utilities."""

from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from src.config import (
    BINARY_MAPPINGS,
    CATEGORICAL_COLUMNS,
    DROP_COLUMNS,
    MODEL_INPUT_COLUMNS,
    NUMERIC_COLUMNS,
    PIPELINE_PATH,
    RANDOM_STATE,
    RAW_DATA_PATH,
    TARGET_COLUMN,
    TEST_SIZE,
)
from src.feature_engineering import add_engineered_features
from src.utils import save_joblib_artifact


def load_data(path: str | Path = RAW_DATA_PATH) -> pd.DataFrame:
    """Load the raw employee attrition dataset."""

    return pd.read_csv(Path(path))


def clean_data(data: pd.DataFrame) -> pd.DataFrame:
    """Drop constant or identifier columns and encode binary notebook fields."""

    cleaned = data.drop(columns=DROP_COLUMNS, errors="ignore").copy()

    for column, mapping in BINARY_MAPPINGS.items():
        if column in cleaned.columns:
            cleaned[column] = cleaned[column].map(lambda value: mapping.get(value, value))

    return cleaned


def build_preprocessing_pipeline(
    numeric_columns: list[str] | None = None,
    categorical_columns: list[str] | None = None,
) -> ColumnTransformer:
    """Create the preprocessing pipeline used by the notebook."""

    numeric_columns = numeric_columns or NUMERIC_COLUMNS
    categorical_columns = categorical_columns or CATEGORICAL_COLUMNS

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, numeric_columns),
            ("cat", categorical_pipeline, categorical_columns),
        ]
    )


def prepare_model_data(data: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series | None]:
    """Clean data, create features, and split features from target if present."""

    prepared = add_engineered_features(clean_data(data))

    if TARGET_COLUMN in prepared.columns:
        target = prepared[TARGET_COLUMN]
        features = prepared.drop(columns=[TARGET_COLUMN])
    else:
        target = None
        features = prepared

    return features[MODEL_INPUT_COLUMNS], target


def split_data(
    features: pd.DataFrame,
    target: pd.Series,
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_STATE,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """Create the same stratified train/test split used in the notebook."""

    splitter = StratifiedShuffleSplit(
        n_splits=1,
        test_size=test_size,
        random_state=random_state,
    )

    train_index, test_index = next(splitter.split(features, target))
    return (
        features.iloc[train_index],
        features.iloc[test_index],
        target.iloc[train_index],
        target.iloc[test_index],
    )


def preprocess_data(
    data: pd.DataFrame,
    pipeline: ColumnTransformer | None = None,
    fit: bool = True,
) -> tuple[Any, pd.Series | None, ColumnTransformer]:
    """Prepare data and fit or apply the preprocessing pipeline."""

    features, target = prepare_model_data(data)
    pipeline = pipeline or build_preprocessing_pipeline()

    if fit:
        transformed_features = pipeline.fit_transform(features)
    else:
        transformed_features = pipeline.transform(features)

    return transformed_features, target, pipeline


def save_pipeline(
    pipeline: ColumnTransformer,
    path: str | Path = PIPELINE_PATH,
) -> Path:
    """Save a fitted preprocessing pipeline."""

    return save_joblib_artifact(pipeline, path)


def load_pipeline(path: str | Path = PIPELINE_PATH) -> ColumnTransformer:
    """Load a fitted preprocessing pipeline."""

    pipeline = joblib.load(Path(path))

    if isinstance(pipeline, ColumnTransformer) and not hasattr(
        pipeline, "force_int_remainder_cols"
    ):
        pipeline.force_int_remainder_cols = False

    return pipeline


def get_feature_names(pipeline: ColumnTransformer) -> list[str]:
    """Return output feature names from a fitted preprocessing pipeline."""

    return list(pipeline.get_feature_names_out())
