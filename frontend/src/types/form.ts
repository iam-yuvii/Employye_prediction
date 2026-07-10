import { EmployeeField } from './employee';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  name: EmployeeField;
  label: string;
  type: 'number' | 'select' | 'slider' | 'radio' | 'switch';
  min?: number;
  max?: number;
  step?: number;
  options?: SelectOption[];
  helper?: string;
}

export interface FormSection {
  title: string;
  description: string;
  fields: FieldConfig[];
}
