import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/25 active:bg-blue-800 dark:active:bg-blue-700 border-transparent active:scale-[0.98]',
  secondary: 'bg-white hover:bg-slate-50/90 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border-slate-300/90 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-xs hover:shadow-sm active:bg-slate-100 dark:active:bg-slate-700 active:scale-[0.98]',
  danger: 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white shadow-xs shadow-rose-600/20 hover:shadow-md hover:shadow-rose-600/25 active:bg-rose-800 dark:active:bg-rose-700 border-transparent active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-transparent active:scale-[0.98]',
  outline: 'bg-transparent border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 active:bg-slate-100 dark:active:bg-slate-800 active:scale-[0.98]',
  brand: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xs shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25 active:bg-emerald-800 dark:active:bg-emerald-700 border-transparent active:scale-[0.98]'
};

const SIZES = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-medium',
  md: 'text-sm px-4 py-2 rounded-xl gap-2 font-medium',
  lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 font-semibold'
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  rightIcon: RightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-150 border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/30 dark:focus-visible:ring-blue-400/30 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{children || 'Loading...'}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children && <span>{children}</span>}
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}