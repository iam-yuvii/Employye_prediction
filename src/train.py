"""Model training and hyperparameter tuning utilities."""

from pathlib import Path
from typing import Any

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold
from sklearn.tree import DecisionTreeClassifier

from src.config import (
    MODEL_PATH,
    RANDOM_STATE,
    XGBOOST_PARAM_DISTRIBUTION,
)
from src.preprocessing import (
    build_preprocessing_pipeline,
    load_data,
    prepare_model_data,
    save_pipeline,
    split_data,
)
from src.utils import save_joblib_artifact


def train_logistic_regression(
    features: Any,
    target: Any,
    random_state: int = RANDOM_STATE,
) -> LogisticRegression:
    """Train the balanced logistic regression model from the notebook."""

    model = LogisticRegression(
        class_weight="balanced",
        random_state=random_state,
        max_iter=1000,
    )
    model.fit(features, target)
    return model


def train_decision_tree(
    features: Any,
    target: Any,
    random_state: int = RANDOM_STATE,
) -> DecisionTreeClassifier:
    """Train the balanced decision tree model from the notebook."""

    model = DecisionTreeClassifier(
        random_state=random_state,
        class_weight="balanced",
    )
    model.fit(features, target)
    return model


def train_random_forest(
    features: Any,
    target: Any,
    random_state: int = RANDOM_STATE,
) -> RandomForestClassifier:
    """Train the balanced random forest model from the notebook."""

    model = RandomForestClassifier(
        random_state=random_state,
        class_weight="balanced",
    )
    model.fit(features, target)
    return model


def _scale_pos_weight(target: Any) -> float:
    negative = (target == 0).sum()
    positive = (target == 1).sum()
    return negative / positive


def _xgboost_classifier(**params: Any) -> Any:
    from xgboost import XGBClassifier

    return XGBClassifier(**params)


def train_xgboost(
    features: Any,
    target: Any,
    random_state: int = RANDOM_STATE,
) -> Any:
    """Train the baseline XGBoost model from the notebook."""

    model = _xgboost_classifier(
        random_state=random_state,
        scale_pos_weight=_scale_pos_weight(target),
        n_estimators=100,
        learning_rate=0.1,
        max_depth=6,
        eval_metric="logloss",
    )
    model.fit(features, target)
    return model


def hyperparameter_tuning(
    estimator: Any,
    features: Any,
    target: Any,
    param_distributions: dict[str, list[Any]] | None = None,
    n_iter: int = 30,
    scoring: str = "f1",
    random_state: int = RANDOM_STATE,
    n_jobs: int = -1,
    verbose: int = 2,
) -> RandomizedSearchCV:
    """Run the XGBoost randomized search from the notebook."""

    cross_validator = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=random_state,
    )

    search = RandomizedSearchCV(
        estimator=estimator,
        param_distributions=param_distributions or XGBOOST_PARAM_DISTRIBUTION,
        n_iter=n_iter,
        scoring=scoring,
        cv=cross_validator,
        verbose=verbose,
        random_state=random_state,
        n_jobs=n_jobs,
    )
    search.fit(features, target)
    return search


def train_and_save_best_model(
    data_path: str | Path | None = None,
    model_path: str | Path = MODEL_PATH,
) -> Any:
    """Retrain the pipeline and tuned XGBoost model, then save both artifacts."""

    raw_data = load_data(data_path) if data_path else load_data()
    features, target = prepare_model_data(raw_data)

    x_train, _, y_train, _ = split_data(features, target)

    pipeline = build_preprocessing_pipeline()
    x_train_prepared = pipeline.fit_transform(x_train)
    save_pipeline(pipeline)

    baseline_xgboost = train_xgboost(x_train_prepared, y_train)
    search = hyperparameter_tuning(baseline_xgboost, x_train_prepared, y_train)
    best_model = search.best_estimator_
    save_joblib_artifact(best_model, model_path)
    return best_model
