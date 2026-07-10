"""Project configuration and shared constants."""

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODELS_DIR = PROJECT_ROOT / "models"
IMAGES_DIR = PROJECT_ROOT / "images"

RAW_DATA_FILENAME = "raw_data.csv"
MODEL_FILENAME = "tuned_xgboost.pkl"
PIPELINE_FILENAME = "preprocessing_pipeline.pkl"

RAW_DATA_PATH = RAW_DATA_DIR / RAW_DATA_FILENAME
MODEL_PATH = MODELS_DIR / MODEL_FILENAME
PIPELINE_PATH = MODELS_DIR / PIPELINE_FILENAME

RANDOM_STATE = 42
TEST_SIZE = 0.2
TARGET_COLUMN = "Attrition"
POSITIVE_CLASS_LABEL = 1
NEGATIVE_CLASS_LABEL = 0
HIGH_RISK_LABEL = "High Risk"
LOW_RISK_LABEL = "Low Risk"

DROP_COLUMNS = [
    "EmployeeCount",
    "StandardHours",
    "Over18",
    "EmployeeNumber",
]

CATEGORICAL_COLUMNS = [
    "BusinessTravel",
    "Department",
    "EducationField",
    "Gender",
    "JobRole",
    "MaritalStatus",
]

NUMERIC_COLUMNS = [
    "Age",
    "DailyRate",
    "DistanceFromHome",
    "Education",
    "EnvironmentSatisfaction",
    "HourlyRate",
    "JobInvolvement",
    "JobLevel",
    "JobSatisfaction",
    "MonthlyIncome",
    "MonthlyRate",
    "NumCompaniesWorked",
    "OverTime",
    "PercentSalaryHike",
    "PerformanceRating",
    "RelationshipSatisfaction",
    "StockOptionLevel",
    "TotalWorkingYears",
    "TrainingTimesLastYear",
    "WorkLifeBalance",
    "YearsAtCompany",
    "YearsInCurrentRole",
    "YearsSinceLastPromotion",
    "YearsWithCurrManager",
    "TenureRatio",
    "PromotionGap",
    "IncomeLevelRatio",
]

ENGINEERED_FEATURES = [
    "TenureRatio",
    "PromotionGap",
    "IncomeLevelRatio",
]

MODEL_INPUT_COLUMNS = [
    "Age",
    "BusinessTravel",
    "DailyRate",
    "Department",
    "DistanceFromHome",
    "Education",
    "EducationField",
    "EnvironmentSatisfaction",
    "Gender",
    "HourlyRate",
    "JobInvolvement",
    "JobLevel",
    "JobRole",
    "JobSatisfaction",
    "MaritalStatus",
    "MonthlyIncome",
    "MonthlyRate",
    "NumCompaniesWorked",
    "OverTime",
    "PercentSalaryHike",
    "PerformanceRating",
    "RelationshipSatisfaction",
    "StockOptionLevel",
    "TotalWorkingYears",
    "TrainingTimesLastYear",
    "WorkLifeBalance",
    "YearsAtCompany",
    "YearsInCurrentRole",
    "YearsSinceLastPromotion",
    "YearsWithCurrManager",
    "TenureRatio",
    "PromotionGap",
    "IncomeLevelRatio",
]

RAW_PREDICTION_COLUMNS = [
    column for column in MODEL_INPUT_COLUMNS if column not in ENGINEERED_FEATURES
]

TARGET_MAPPING = {"No": NEGATIVE_CLASS_LABEL, "Yes": POSITIVE_CLASS_LABEL}
BINARY_MAPPINGS = {
    TARGET_COLUMN: TARGET_MAPPING,
    "OverTime": {"No": 0, "Yes": 1},
}

XGBOOST_PARAM_DISTRIBUTION = {
    "n_estimators": [100, 200, 300, 500],
    "max_depth": [3, 4, 5, 6, 8],
    "learning_rate": [0.01, 0.05, 0.1, 0.2],
    "subsample": [0.8, 0.9, 1.0],
    "colsample_bytree": [0.6, 0.8, 1.0],
    "min_child_weight": [1, 3, 5],
    "gamma": [0, 0.1, 0.3],
}
