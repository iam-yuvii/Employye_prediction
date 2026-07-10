import { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { EmployeeField, EmployeePayload } from '../types/employee';
import { FieldConfig } from '../types/form';
import { formSections } from '../services/formConfig';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { Input } from './Input';
import { Slider } from './Slider';

interface PredictionFormProps {
  value: EmployeePayload;
  onChange: (value: EmployeePayload) => void;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
}

function numericFields(): Set<EmployeeField> {
  return new Set(
    formSections.flatMap((section) =>
      section.fields
        .filter((field) => field.type === 'number' || field.type === 'slider')
        .map((field) => field.name),
    ),
  );
}

const numericFieldSet = numericFields();

export function PredictionForm({
  value,
  onChange,
  onSubmit,
  loading = false,
  submitLabel = 'Predict attrition risk',
}: PredictionFormProps) {
  const setField = (name: EmployeeField, nextValue: string | number) => {
    onChange({
      ...value,
      [name]: numericFieldSet.has(name) ? Number(nextValue) : nextValue,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const renderField = (field: FieldConfig) => {
    const fieldValue = value[field.name];

    if (field.type === 'select') {
      return (
        <Dropdown
          key={field.name}
          label={field.label}
          options={field.options ?? []}
          value={String(fieldValue)}
          onChange={(event) => setField(field.name, event.target.value)}
          helper={field.helper}
        />
      );
    }

    if (field.type === 'slider') {
      return (
        <Slider
          key={field.name}
          label={field.label}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          value={Number(fieldValue)}
          onChange={(event) => setField(field.name, event.target.value)}
        />
      );
    }

    if (field.type === 'radio') {
      return (
        <fieldset key={field.name} className="space-y-2">
          <legend className="label">{field.label}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(field.options ?? []).map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => setField(field.name, option.value)}
                className={`h-11 rounded-lg border px-3 text-sm font-semibold transition ${
                  fieldValue === option.value
                    ? 'border-brand bg-blue-50 text-brand dark:bg-blue-950'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      );
    }

    if (field.type === 'switch') {
      const isEnabled = fieldValue === 'Yes';
      return (
        <label key={field.name} className="space-y-2">
          <span className="label">{field.label}</span>
          <button
            type="button"
            onClick={() => setField(field.name, isEnabled ? 'No' : 'Yes')}
            className={`flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm font-semibold transition ${
              isEnabled
                ? 'border-brand bg-blue-50 text-brand dark:bg-blue-950'
                : 'border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200'
            }`}
          >
            <span>{isEnabled ? 'Yes' : 'No'}</span>
            <span
              className={`relative h-5 w-9 rounded-full transition ${
                isEnabled ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                  isEnabled ? 'left-4' : 'left-0.5'
                }`}
              />
            </span>
          </button>
        </label>
      );
    }

    return (
      <Input
        key={field.name}
        label={field.label}
        type="number"
        min={field.min}
        max={field.max}
        step={field.step ?? 1}
        value={Number(fieldValue)}
        onChange={(event) => setField(field.name, event.target.value)}
        helper={field.helper}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={loading} className="space-y-6 disabled:opacity-75">
      {formSections.map((section, index) => (
        <motion.section
          key={section.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="surface p-5"
        >
          <div className="mb-5 border-b border-gray-200 pb-4 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">{section.title}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.fields.map(renderField)}
          </div>
        </motion.section>
      ))}
      </fieldset>
      <div className="sticky bottom-4 z-20 flex justify-end">
        <div className="rounded-lg border border-gray-200 bg-white/90 p-2 shadow-panel backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
