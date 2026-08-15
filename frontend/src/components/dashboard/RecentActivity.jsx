import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { getDueDateStatus } from '../../utils/formatters';
import { ArrowRight, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../common/Button';

export function RecentActivity({ overdueTasks = [], recentTasks = [], onSelectTask, onViewAllTasks }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Overdue Urgent Action List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Attention Required (Overdue)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tasks past their scheduled deadline</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
            {overdueTasks.length} Overdue
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {overdueTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              🎉 No overdue tasks! All assignments are on schedule.
            </div>
          ) : (
            overdueTasks.map((task) => {
              const dueInfo = getDueDateStatus(task.due_date, task.status);
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task.id)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-rose-50/40 dark:hover:bg-rose-950/30 p-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="text-rose-600 dark:text-rose-400 font-medium">{dueInfo.text}</span>
                      <span>•</span>
                      <span>{task.assignee_name || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={task.priority} size="xs" />
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recently Created Tasks */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recently Created Tasks</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest pipeline assignments</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAllTasks} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View All
          </Button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task.id)}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 p-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <StatusBadge status={task.status} size="xs" />
                  <span>•</span>
                  <span>{task.assignee_name || 'Unassigned'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <PriorityBadge priority={task.priority} size="xs" />
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}