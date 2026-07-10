"""Evaluation metrics and reusable plotting functions."""

from typing import Any

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
    roc_curve,
)


def confusion_matrix_plot(
    y_true: Any,
    y_pred: Any,
    title: str = "Confusion Matrix",
    cmap: str = "Blues",
) -> plt.Axes:
    """Plot a labeled confusion matrix."""

    matrix = confusion_matrix(y_true, y_pred)
    _, axis = plt.subplots(figsize=(5, 4))
    sns.heatmap(
        matrix,
        annot=True,
        fmt="d",
        cmap=cmap,
        xticklabels=["Stayed", "Left"],
        yticklabels=["Stayed", "Left"],
        ax=axis,
    )
    axis.set_title(title)
    axis.set_xlabel("Predicted")
    axis.set_ylabel("Actual")
    return axis


def roc_curve_plot(
    y_true: Any,
    y_scores: Any,
    title: str = "ROC Curve",
) -> plt.Axes:
    """Plot a ROC curve using positive-class scores."""

    false_positive_rate, true_positive_rate, _ = roc_curve(y_true, y_scores)
    auc_score = roc_auc_score(y_true, y_scores)

    _, axis = plt.subplots(figsize=(6, 4))
    axis.plot(false_positive_rate, true_positive_rate, label=f"AUC = {auc_score:.3f}")
    axis.plot([0, 1], [0, 1], linestyle="--", color="gray")
    axis.set_title(title)
    axis.set_xlabel("False Positive Rate")
    axis.set_ylabel("True Positive Rate")
    axis.legend()
    return axis


def pr_curve_plot(
    y_true: Any,
    y_scores: Any,
    title: str = "Precision-Recall Curve",
) -> plt.Axes:
    """Plot a precision-recall curve using positive-class scores."""

    precision, recall, _ = precision_recall_curve(y_true, y_scores)

    _, axis = plt.subplots(figsize=(6, 4))
    axis.plot(recall, precision)
    axis.set_title(title)
    axis.set_xlabel("Recall")
    axis.set_ylabel("Precision")
    return axis


def evaluate_model(model: Any, features: Any, target: Any) -> dict[str, Any]:
    """Evaluate one fitted model and return common classification metrics."""

    predictions = model.predict(features)
    metrics = {
        "accuracy": accuracy_score(target, predictions),
        "precision": precision_score(target, predictions),
        "recall": recall_score(target, predictions),
        "f1": f1_score(target, predictions),
        "confusion_matrix": confusion_matrix(target, predictions),
        "classification_report": classification_report(target, predictions),
    }

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[:, 1]
        metrics["roc_auc"] = roc_auc_score(target, probabilities)

    return metrics


def compare_models(
    models: dict[str, Any],
    features: Any,
    target: Any,
) -> pd.DataFrame:
    """Compare fitted models using the notebook's core metrics."""

    rows = []
    for name, model in models.items():
        metrics = evaluate_model(model, features, target)
        rows.append(
            {
                "model": name,
                "accuracy": metrics["accuracy"],
                "precision": metrics["precision"],
                "recall": metrics["recall"],
                "f1": metrics["f1"],
                "roc_auc": metrics.get("roc_auc"),
            }
        )

    return pd.DataFrame(rows).sort_values("f1", ascending=False)
