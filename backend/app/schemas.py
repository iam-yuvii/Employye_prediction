"""Pydantic request and response schemas."""

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class EmployeeRequest(BaseModel):
    """Original employee feature payload accepted by the API."""

    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    age: int = Field(..., alias="Age", ge=18, le=70)
    business_travel: Literal[
        "Non-Travel",
        "Travel_Frequently",
        "Travel_Rarely",
    ] = Field(..., alias="BusinessTravel")
    daily_rate: int = Field(..., alias="DailyRate", ge=0)
    department: Literal[
        "Human Resources",
        "Research & Development",
        "Sales",
    ] = Field(..., alias="Department")
    distance_from_home: int = Field(..., alias="DistanceFromHome", ge=0)
    education: int = Field(..., alias="Education", ge=1, le=5)
    education_field: Literal[
        "Human Resources",
        "Life Sciences",
        "Marketing",
        "Medical",
        "Other",
        "Technical Degree",
    ] = Field(..., alias="EducationField")
    employee_count: int = Field(..., alias="EmployeeCount", ge=0)
    employee_number: int = Field(..., alias="EmployeeNumber", ge=0)
    environment_satisfaction: int = Field(
        ...,
        alias="EnvironmentSatisfaction",
        ge=1,
        le=4,
    )
    gender: Literal["Female", "Male"] = Field(..., alias="Gender")
    hourly_rate: int = Field(..., alias="HourlyRate", ge=0)
    job_involvement: int = Field(..., alias="JobInvolvement", ge=1, le=4)
    job_level: int = Field(..., alias="JobLevel", ge=1, le=5)
    job_role: Literal[
        "Healthcare Representative",
        "Human Resources",
        "Laboratory Technician",
        "Manager",
        "Manufacturing Director",
        "Research Director",
        "Research Scientist",
        "Sales Executive",
        "Sales Representative",
    ] = Field(..., alias="JobRole")
    job_satisfaction: int = Field(..., alias="JobSatisfaction", ge=1, le=4)
    marital_status: Literal["Divorced", "Married", "Single"] = Field(
        ...,
        alias="MaritalStatus",
    )
    monthly_income: int = Field(..., alias="MonthlyIncome", ge=0)
    monthly_rate: int = Field(..., alias="MonthlyRate", ge=0)
    num_companies_worked: int = Field(..., alias="NumCompaniesWorked", ge=0)
    over18: Literal["Y"] = Field(..., alias="Over18")
    over_time: Literal["No", "Yes"] = Field(..., alias="OverTime")
    percent_salary_hike: int = Field(..., alias="PercentSalaryHike", ge=0)
    performance_rating: int = Field(..., alias="PerformanceRating", ge=1, le=4)
    relationship_satisfaction: int = Field(
        ...,
        alias="RelationshipSatisfaction",
        ge=1,
        le=4,
    )
    standard_hours: int = Field(..., alias="StandardHours", ge=0)
    stock_option_level: int = Field(..., alias="StockOptionLevel", ge=0, le=3)
    total_working_years: int = Field(..., alias="TotalWorkingYears", ge=0)
    training_times_last_year: int = Field(
        ...,
        alias="TrainingTimesLastYear",
        ge=0,
    )
    work_life_balance: int = Field(..., alias="WorkLifeBalance", ge=1, le=4)
    years_at_company: int = Field(..., alias="YearsAtCompany", ge=0)
    years_in_current_role: int = Field(..., alias="YearsInCurrentRole", ge=0)
    years_since_last_promotion: int = Field(
        ...,
        alias="YearsSinceLastPromotion",
        ge=0,
    )
    years_with_curr_manager: int = Field(..., alias="YearsWithCurrManager", ge=0)

    def to_original_feature_dict(self) -> dict[str, Any]:
        """Return a dictionary using the original dataset column names."""

        return self.model_dump(by_alias=True)


class RootResponse(BaseModel):
    """Root endpoint response."""

    project: str
    status: str


class HealthResponse(BaseModel):
    """Health endpoint response."""

    status: str


class PredictionResponse(BaseModel):
    """Prediction endpoint response."""

    prediction: str
    probability: float
    risk_level: str


class FeatureImpact(BaseModel):
    """One SHAP feature contribution."""

    feature: str
    impact: float


class ExplanationResponse(PredictionResponse):
    """Structured SHAP explanation response."""

    positive_features: list[FeatureImpact]
    negative_features: list[FeatureImpact]
    shap_values: list[FeatureImpact]
    business_recommendations: list[str]


class ModelInfoResponse(BaseModel):
    """Model metadata response."""

    model_name: str
    algorithm: str
    training_accuracy: float | None
    roc_auc: float | None
    pr_auc: float | None
    precision: float | None
    recall: float | None
    f1_score: float | None
    training_date: str | None
    number_of_features: int


class ErrorResponse(BaseModel):
    """Standard error response."""

    detail: str
