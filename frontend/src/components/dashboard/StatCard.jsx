import {
  CheckSquare,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ArrowRight
} from 'lucide-react';

const TYPE_CONFIG = {
  total: {
    label: 'Total Backlog',
    icon: CheckSquare,
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    border: 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
    hoverGlow: 'hover:shadow-slate-200/60 dark:hover:shadow-slate-900/50'
  },
  pending: {
    label: 'Pending Pickup',
    icon: Clock,
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    border: 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
    hoverGlow: 'hover:shadow-slate-200/60 dark:hover:shadow-slate-900/50'
  },
  in_progress: {
    label: 'In Active Progress',
    icon: PlayCircle,
    bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400',
    border: 'border-blue-200/90 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-800',
    hoverGlow: 'hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20'
  },
  completed: {
    label: 'Completed Tasks',
    icon: CheckCircle2,
    bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    border: 'border-emerald-200/90 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-800',
    hoverGlow: 'hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20'
  },
  overdue: {
    label: 'Overdue Deadline',
    icon: AlertTriangle,
    bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
    border: 'border-rose-300 dark:border-rose-900/80 ring-1 ring-rose-500/20 bg-rose-50/20 dark:bg-rose-950/20',
    hoverGlow: 'hover:shadow-rose-500/15 dark:hover:shadow-rose-500/25',
    highlight: true
  },
  assigned_to_me: {
    label: 'Assigned to Me',
    icon: UserCheck,
    bg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400',
    border: 'border-indigo-200/90 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-800',
    hoverGlow: 'hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20'
  }
};

export function StatCard({ type = 'total', value = 0, subtext, onClick, isFiltered = false }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.total;
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 ${config.border} ${config.hoverGlow} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${isFiltered ? 'ring-2 ring-blue-600 dark:ring-blue-500 shadow-md' : 'shadow-sm'}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {config.label}
          </div>
          <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-baseline gap-2 tabular-nums">
            <span>{value}</span>
            {config.highlight && value > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                Action Req.
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl ${config.bg} shrink-0 transition-transform duration-200 group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {subtext && (
        <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
          <span className="truncate">{subtext}</span>
          {onClick && (
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          )}
        </div>
      )}
    </div>
  );
}