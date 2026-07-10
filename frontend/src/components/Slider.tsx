import { InputHTMLAttributes } from 'react';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
}

export function Slider({ label, value, min, max, ...props }: SliderProps) {
  return (
    <label className="space-y-2">
      <span className="flex items-center justify-between gap-3">
        <span className="label">{label}</span>
        <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-brand dark:bg-blue-950">
          {value}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand dark:bg-gray-800"
        {...props}
      />
    </label>
  );
}
