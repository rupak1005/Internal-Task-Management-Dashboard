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
    label: 'Total Tasks',
    icon: CheckSquare,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    border: 'border-slate-200',
    accentColor: 'text-blue-700'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    bg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    border: 'border-slate-200',
    accentColor: 'text-slate-700'
  },
  in_progress: {
    label: 'In Progress',
    icon: PlayCircle,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    border: 'border-blue-200',
    accentColor: 'text-blue-700'
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-200',
    accentColor: 'text-emerald-700'
  },
  overdue: {
    label: 'Overdue Tasks',
    icon: AlertTriangle,
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    border: 'border-rose-300 ring-2 ring-rose-500/20 shadow-rose-500/5',
    accentColor: 'text-rose-700',
    highlight: true
  },
  assigned_to_me: {
    label: 'Assigned to Me',
    icon: UserCheck,
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    border: 'border-indigo-200',
    accentColor: 'text-indigo-700'
  }
};

export function StatCard({ type = 'total', value = 0, subtext, onClick, isFiltered = false }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.total;
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-white border transition-all duration-200 ${config.border} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${isFiltered ? 'ring-2 ring-blue-500 shadow-md' : 'shadow-sm'}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {config.label}
          </div>
          <div className="text-3xl font-bold tracking-tight text-slate-900 flex items-baseline gap-2">
            <span>{value}</span>
            {config.highlight && value > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 animate-pulse">
                Needs Attention
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${config.bg} ${config.iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {subtext && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span>{subtext}</span>
          {onClick && <ArrowRight className="w-3.5 h-3.5 text-slate-400" />}
        </div>
      )}
    </div>
  );
}
