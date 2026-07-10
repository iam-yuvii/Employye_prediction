export type BusinessTravel =
  | 'Non-Travel'
  | 'Travel_Frequently'
  | 'Travel_Rarely';

export type Department = 'Human Resources' | 'Research & Development' | 'Sales';
export type EducationField =
  | 'Human Resources'
  | 'Life Sciences'
  | 'Marketing'
  | 'Medical'
  | 'Other'
  | 'Technical Degree';
export type Gender = 'Female' | 'Male';
export type JobRole =
  | 'Healthcare Representative'
  | 'Human Resources'
  | 'Laboratory Technician'
  | 'Manager'
  | 'Manufacturing Director'
  | 'Research Director'
  | 'Research Scientist'
  | 'Sales Executive'
  | 'Sales Representative';
export type MaritalStatus = 'Divorced' | 'Married' | 'Single';
export type YesNo = 'Yes' | 'No';

export interface EmployeePayload {
  Age: number;
  BusinessTravel: BusinessTravel;
  DailyRate: number;
  Department: Department;
  DistanceFromHome: number;
  Education: number;
  EducationField: EducationField;
  EmployeeCount: number;
  EmployeeNumber: number;
  EnvironmentSatisfaction: number;
  Gender: Gender;
  HourlyRate: number;
  JobInvolvement: number;
  JobLevel: number;
  JobRole: JobRole;
  JobSatisfaction: number;
  MaritalStatus: MaritalStatus;
  MonthlyIncome: number;
  MonthlyRate: number;
  NumCompaniesWorked: number;
  Over18: 'Y';
  OverTime: YesNo;
  PercentSalaryHike: number;
  PerformanceRating: number;
  RelationshipSatisfaction: number;
  StandardHours: number;
  StockOptionLevel: number;
  TotalWorkingYears: number;
  TrainingTimesLastYear: number;
  WorkLifeBalance: number;
  YearsAtCompany: number;
  YearsInCurrentRole: number;
  YearsSinceLastPromotion: number;
  YearsWithCurrManager: number;
}

export interface PredictionResponse {
  prediction: string;
  probability: number;
  risk_level: string;
}

export interface FeatureImpact {
  feature: string;
  impact: number;
}

export interface ExplanationResponse extends PredictionResponse {
  positive_features: FeatureImpact[];
  negative_features: FeatureImpact[];
  shap_values: FeatureImpact[];
  business_recommendations: string[];
}

export interface ModelInfo {
  model_name: string;
  algorithm: string;
  training_accuracy: number | null;
  roc_auc: number | null;
  pr_auc: number | null;
  precision: number | null;
  recall: number | null;
  f1_score: number | null;
  training_date: string | null;
  number_of_features: number;
}

export interface RootStatus {
  project: string;
  status: string;
}

export interface HealthStatus {
  status: string;
}

export type EmployeeField = keyof EmployeePayload;
