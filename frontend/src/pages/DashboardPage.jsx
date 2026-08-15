import { useState, useEffect, useCallback } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskDistribution } from '../components/dashboard/TaskDistribution';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { tasksService } from '../services/tasks.service';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Plus, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export function DashboardPage({ onSelectTab, onSelectTask, onOpenCreateTask, onFilterByStatus }) {
  const { currentUser } = useUser();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await tasksService.getDashboardMetrics(currentUser?.id);
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      toast.error(`Dashboard error: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Operations & Task Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time pipeline metrics, team workload, and workflow tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            isLoading={refreshing}
            onClick={() => fetchDashboardData(true)}
          >
            Refresh Data
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onOpenCreateTask}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Completion Rate Executive Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background gradient orbs */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 rounded-full bg-emerald-600/10 blur-2xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Workflow Completion Rate</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {metrics.completion_rate || 0}% of deliverables completed
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            {metrics.completed || 0} tasks resolved out of {metrics.total || 0} total assignments.
            {metrics.overdue > 0 ? (
              <span className="text-rose-400 font-medium ml-1">
                ⚠️ {metrics.overdue} tasks currently require immediate review.
              </span>
            ) : (
              <span className="text-emerald-400 font-medium ml-1">
                ✨ All deliverables are running on schedule.
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Button
            variant="secondary"
            size="md"
            rightIcon={ArrowRight}
            onClick={() => onSelectTab('tasks')}
            className="bg-white text-slate-900 hover:bg-slate-100 border-transparent font-semibold shadow-md"
          >
            Manage Backlog
          </Button>
        </div>
      </div>

      {/* Stat Summary Cards Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          type="total"
          value={metrics.total || 0}
          subtext="Complete backlog"
          onClick={() => onFilterByStatus('')}
        />
        <StatCard
          type="pending"
          value={metrics.pending || 0}
          subtext="Awaiting pickup"
          onClick={() => onFilterByStatus('pending')}
        />
        <StatCard
          type="in_progress"
          value={metrics.in_progress || 0}
          subtext="Active in progress"
          onClick={() => onFilterByStatus('in_progress')}
        />
        <StatCard
          type="completed"
          value={metrics.completed || 0}
          subtext="Resolved & closed"
          onClick={() => onFilterByStatus('completed')}
        />
        <StatCard
          type="overdue"
          value={metrics.overdue || 0}
          subtext="Past scheduled deadline"
          onClick={() => onFilterByStatus('')}
        />
        <StatCard
          type="assigned_to_me"
          value={metrics.assigned_to_me || 0}
          subtext={`Assigned to ${currentUser?.name ? currentUser.name.split(' ')[0] : 'Me'}`}
          onClick={() => onFilterByStatus('', currentUser?.id)}
        />
      </div>

      {/* Distribution Breakdown Progress Bars */}
      <TaskDistribution
        statusDistribution={data?.status_distribution || []}
        priorityDistribution={data?.priority_distribution || []}
        total={metrics.total || 0}
      />

      {/* Overdue Attention List & Recent Tasks */}
      <RecentActivity
        overdueTasks={data?.overdue_tasks || []}
        recentTasks={data?.recent_tasks || []}
        onSelectTask={onSelectTask}
        onViewAllTasks={() => onSelectTab('tasks')}
      />
    </div>
  );
}
