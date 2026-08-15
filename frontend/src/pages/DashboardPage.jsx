import { useState, useEffect, useCallback } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskDistribution } from '../components/dashboard/TaskDistribution';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { tasksService } from '../services/tasks.service';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { Plus, RefreshCw, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
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
            Refresh
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

      {/* Completion Rate Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Workflow Completion Rate</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {metrics.completion_rate || 0}% of all tasks completed
          </h2>
          <p className="text-xs text-blue-100 max-w-xl">
            {metrics.completed || 0} tasks resolved out of {metrics.total || 0} total assignments.
            {metrics.overdue > 0 && ` ${metrics.overdue} tasks currently require immediate review.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelectTab('tasks')}
            className="bg-white text-blue-700 hover:bg-blue-50 border-transparent font-semibold shadow"
          >
            Manage All Tasks
          </Button>
        </div>
      </div>

      {/* Stat Summary Cards Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          type="total"
          value={metrics.total || 0}
          subtext="View complete backlog"
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
          subtext="Currently active"
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
          subtext="Past target date"
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
