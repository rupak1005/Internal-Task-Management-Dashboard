import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/constants';

export function TaskDistribution({ statusDistribution = [], priorityDistribution = [], total = 0 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Task Status Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Workflow stages across active tasks</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {total} Total
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {statusDistribution.map((item) => {
            const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                    <span className="font-medium text-slate-700">{config.label}</span>
                  </div>
                  <div className="text-slate-500 font-medium">
                    {item.count} <span className="text-slate-400">({percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.dotClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Priority Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Urgency distribution of workload</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {total} Total
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {priorityDistribution.map((item) => {
            const config = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <div key={item.priority} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                    <span className="font-medium text-slate-700">{config.label}</span>
                  </div>
                  <div className="text-slate-500 font-medium">
                    {item.count} <span className="text-slate-400">({percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${config.dotClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
