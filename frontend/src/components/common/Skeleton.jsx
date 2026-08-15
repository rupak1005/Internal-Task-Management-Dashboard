export function Skeleton({ className = '', variant = 'text' }) {
  const baseClasses = 'bg-slate-200 dark:bg-slate-700/70 animate-shimmer rounded transition-colors';

  if (variant === 'circle') {
    return <div className={`${baseClasses} rounded-full ${className}`} />;
  }

  if (variant === 'card') {
    return (
      <div className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 transition-colors ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/70 rounded animate-shimmer" />
          <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700/70 animate-shimmer" />
        </div>
        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700/70 rounded animate-shimmer" />
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700/70 rounded animate-shimmer" />
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <tr className="border-b border-slate-100 dark:border-slate-800">
        <td className="px-4 py-4"><div className="h-4 w-48 bg-slate-200 dark:bg-slate-700/70 rounded animate-shimmer" /></td>
        <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-700/70 rounded-full animate-shimmer" /></td>
        <td className="px-4 py-4"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-700/70 rounded-md animate-shimmer" /></td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700/70 animate-shimmer" />
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/70 rounded animate-shimmer" />
          </div>
        </td>
        <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-700/70 rounded animate-shimmer" /></td>
        <td className="px-4 py-4 text-right"><div className="h-8 w-16 bg-slate-200 dark:bg-slate-700/70 rounded-lg ml-auto animate-shimmer" /></td>
      </tr>
    );
  }

  return <div className={`${baseClasses} ${className}`} />;
}