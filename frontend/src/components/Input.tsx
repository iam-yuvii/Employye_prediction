import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
}

export function Input({ label, helper, className = '', ...props }: InputProps) {
  return (
    <label className="space-y-2">
      <span className="label">{label}</span>
      <input className={`field ${className}`} {...props} />
      {helper ? <span className="text-xs text-gray-500 dark:text-gray-400">{helper}</span> : null}
    </label>
  );
}
