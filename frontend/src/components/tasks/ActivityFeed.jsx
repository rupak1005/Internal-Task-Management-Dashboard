import { formatRelativeTime } from '../../utils/formatters';
import { History, CheckCircle2, Clock, Edit3, MessageSquare, PlusCircle } from 'lucide-react';

const ACTION_ICONS = {
  CREATED: PlusCircle,
  STATUS_CHANGED: CheckCircle2,
  UPDATED: Edit3,
  NOTE_ADDED: MessageSquare,
  DELETED: History,
  DEFAULT: History
};

const ACTION_COLORS = {
  CREATED: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
  STATUS_CHANGED: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60',
  UPDATED: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60',
  NOTE_ADDED: 'bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60',
  DEFAULT: 'bg-slate-50 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
};

export function ActivityFeed({ activity = [] }) {
  if (activity.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 text-center transition-colors">
        No recorded mutation events yet for this task.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Activity History & Audit Log ({activity.length})
        </h4>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activity.map((item) => {
          const Icon = ACTION_ICONS[item.action] || ACTION_ICONS.DEFAULT;
          const colorClass = ACTION_COLORS[item.action] || ACTION_COLORS.DEFAULT;

          return (
            <div key={item.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-xs group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors">
                <Icon className="w-3 h-3" />
              </div>

              {/* Event card */}
              <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1 transition-colors hover:border-slate-300 dark:hover:border-slate-700">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.user_name || 'System'}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${colorClass}`}>
                      {item.action.replace('_', ' ')}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(item.created_at)}</span>
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}