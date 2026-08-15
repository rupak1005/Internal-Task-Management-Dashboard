import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    rows = 3,
    className = '',
    required = false,
    id,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {label}
          {required && <span className="text-rose-500 dark:text-rose-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`block w-full text-sm rounded-lg border bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 dark:border-rose-800 focus:border-rose-500 dark:focus:border-rose-400 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400'
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
});