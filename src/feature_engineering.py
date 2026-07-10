"""Feature engineering used by the attrition model."""

import numpy as np
import pandas as pd


def add_tenure_ratio(data: pd.DataFrame) -> pd.DataFrame:
    """Add the ratio of company tenure to total working years."""

    data = data.copy()
    data["TenureRatio"] = (
        data["YearsAtCompany"] / data["TotalWorkingYears"].replace(0, np.nan)
    )
    data["TenureRatio"] = data["TenureRatio"].fillna(0)
    return data


def add_promotion_gap(data: pd.DataFrame) -> pd.DataFrame:
    """Add the gap between total company tenure and years since promotion."""

    data = data.copy()
    data["PromotionGap"] = data["YearsAtCompany"] - data["YearsSinceLastPromotion"]
    return data


def add_income_level_ratio(data: pd.DataFrame) -> pd.DataFrame:
    """Add income normalized by job level."""

    data = data.copy()
    data["IncomeLevelRatio"] = data["MonthlyIncome"] / data["JobLevel"].replace(
        0, np.nan
    )
    return data


def add_engineered_features(data: pd.DataFrame) -> pd.DataFrame:
    """Apply all engineered features from the original notebook."""

    data = add_tenure_ratio(data)
    data = add_promotion_gap(data)
    data = add_income_level_ratio(data)
    return data
