import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatDateTime } from '../utils/formatters';
import { Pagination } from '../components/common/Pagination';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { ShieldCheck, ShieldAlert, RefreshCw, Filter, Clock, User, ArrowRight } from 'lucide-react';

export function AuditLogsPage({ onSelectTask }) {
  const { isAdmin, user } = useAuth();
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = useCallback(async (page = 1) => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await authService.getAuditLogs({
        page,
        limit: pagination.limit,
        action: actionFilter || undefined
      });
      setLogs(res.data || []);
      setPagination(res.pagination || { page, limit: 15, total: 0, total_pages: 1 });
    } catch (err) {
      toast.error(`Failed to load audit logs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, pagination.limit, actionFilter, toast]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 w-16 h-16 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Access Restricted</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          System audit logs are restricted to members with the <span className="font-semibold text-slate-800 dark:text-slate-200">Admin</span> role. Your active account is <span className="font-semibold">{user?.name}</span> ({user?.role}).
        </p>
      </div>
    );
  }

  const actions = ['All Actions', 'CREATED', 'STATUS_CHANGED', 'UPDATED', 'NOTE_ADDED', 'DELETED'];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              System Audit & Compliance Log
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Protected</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable chronological record of all task modifications, assignments, and status transitions.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          isLoading={loading}
          onClick={() => fetchLogs(pagination.page)}
        >
          Refresh
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">Filter Action:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {actions.map((act) => {
            const isSelected = (!actionFilter && act === 'All Actions') || actionFilter === act;
            return (
              <button
                key={act}
                onClick={() => setActionFilter(act === 'All Actions' ? '' : act)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {act.replace('_', ' ')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {loading && logs.length === 0 ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-slate-500 dark:text-slate-400">
          No audit records found matching the selected filter.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                    {log.user_avatar ? (
                      <img
                        src={log.user_avatar}
                        alt={log.user_name || 'User'}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{log.user_name || 'System'}</span>
                  </span>

                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {log.action.replace('_', ' ')}
                  </span>

                  {log.task_id && (
                    <button
                      onClick={() => onSelectTask && onSelectTask(log.task_id)}
                      className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Task #{log.task_id}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {log.details}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1 sm:self-start">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDateTime(log.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        totalItems={pagination.total}
        pageSize={pagination.limit}
        onPageChange={(p) => fetchLogs(p)}
      />
    </div>
  );
}
