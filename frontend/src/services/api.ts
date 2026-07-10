import axios from 'axios';
import {
  EmployeePayload,
  ExplanationResponse,
  HealthStatus,
  ModelInfo,
  PredictionResponse,
  RootStatus,
} from '../types/employee';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

function apiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return new Error('The request timed out. Please try again in a moment.');
    }
    if (!error.response) {
      return new Error(
        'The backend is unavailable. Confirm the API is running and your network connection is active.',
      );
    }

    const status = error.response.status;
    const detail = error.response?.data?.detail;

    if (status === 400 || status === 422) {
      return new Error('Please review the employee details and correct invalid fields.');
    }
    if (status === 401) {
      return new Error('You are not authorized to use this service.');
    }
    if (status === 404) {
      return new Error('The requested API resource could not be found.');
    }
    if (status >= 500) {
      return new Error('The prediction service hit an internal error. Please try again later.');
    }
    if (typeof detail === 'string' && !detail.toLowerCase().includes('traceback')) {
      return new Error(detail);
    }
    if (Array.isArray(error.response?.data?.errors)) {
      return new Error('Please review the highlighted fields and try again.');
    }
    return new Error(error.message || 'API request failed.');
  }

  return new Error('Unexpected application error.');
}

export async function getRootStatus(): Promise<RootStatus> {
  try {
    const response = await client.get<RootStatus>('/');
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}

export async function getHealth(): Promise<HealthStatus> {
  try {
    const response = await client.get<HealthStatus>('/health');
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}

export async function predict(
  payload: EmployeePayload,
): Promise<PredictionResponse> {
  try {
    const response = await client.post<PredictionResponse>('/predict', payload);
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}

export async function explain(
  payload: EmployeePayload,
): Promise<ExplanationResponse> {
  try {
    const response = await client.post<ExplanationResponse>('/explain', payload);
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}

export async function getModelInfo(): Promise<ModelInfo> {
  try {
    const response = await client.get<ModelInfo>('/model-info');
    return response.data;
  } catch (error) {
    throw apiError(error);
  }
}
