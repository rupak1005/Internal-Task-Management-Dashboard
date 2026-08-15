import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/25 active:bg-blue-800 border-transparent active:scale-[0.98]',
  secondary: 'bg-white hover:bg-slate-50/90 text-slate-700 border-slate-300/90 hover:border-slate-400 shadow-sm hover:shadow active:bg-slate-100 active:scale-[0.98]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 hover:shadow-md hover:shadow-rose-600/25 active:bg-rose-800 border-transparent active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border-transparent active:scale-[0.98]',
  outline: 'bg-transparent border-slate-300 hover:bg-slate-50 text-slate-700 hover:border-slate-400 active:bg-slate-100 active:scale-[0.98]',
  brand: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25 active:bg-emerald-800 border-transparent active:scale-[0.98]'
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
      className={`inline-flex items-center justify-center transition-all duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer ${variantClass} ${sizeClass} ${className}`}
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
          <span>{children}</span>
          {RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
