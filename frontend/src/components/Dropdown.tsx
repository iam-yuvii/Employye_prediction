import { SelectHTMLAttributes } from 'react';
import { SelectOption } from '../types/form';

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  helper?: string;
}

export function Dropdown({
  label,
  options,
  helper,
  className = '',
  ...props
}: DropdownProps) {
  return (
    <label className="space-y-2">
      <span className="label">{label}</span>
      <select className={`field ${className}`} {...props}>
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper ? <span className="text-xs text-gray-500 dark:text-gray-400">{helper}</span> : null}
    </label>
  );
}
