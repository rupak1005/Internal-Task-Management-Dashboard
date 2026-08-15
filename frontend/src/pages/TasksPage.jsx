import { useState } from 'react';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskTable } from '../components/tasks/TaskTable';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { Plus, RefreshCw, LayoutGrid, Table as TableIcon } from 'lucide-react';

export function TasksPage({
  useTasksHook,
  onOpenCreateTask,
  onEditTask,
  onDeleteTask,
  onSelectTask
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  const {
    tasks,
    pagination,
    loading,
    filters,
    updateFilters,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    patchTaskStatus,
    refetch,
    resetFilters
  } = useTasksHook;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Task Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80">
              {pagination.total} Tasks
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Filter, search, organize, and update team deliverables in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle: Table View | Kanban Board */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/90 dark:border-slate-700">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>

            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            isLoading={loading}
            onClick={refetch}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => onOpenCreateTask()}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <TaskFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
        totalResults={pagination.total}
        isLoading={loading}
      />

      {/* View Content (Table or Kanban) */}
      {loading && tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3 transition-colors">
          <table className="min-w-full">
            <tbody>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="table-row" />
              ))}
            </tbody>
          </table>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks match your criteria"
          description="We couldn't find any tasks matching the current filters or search terms. Try clearing your filters or creating a new task."
          actionLabel="Create New Task"
          onAction={() => onOpenCreateTask()}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onPatchStatus={patchTaskStatus}
          onSelectTask={onSelectTask}
          onOpenCreateTask={(colStatus) => onOpenCreateTask({ status: colStatus })}
        />
      ) : (
        <div className="space-y-4">
          <TaskTable
            tasks={tasks}
            sortField={filters.sort_by}
            sortOrder={filters.order}
            onSort={handleSortChange}
            onSelectTask={onSelectTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onPatchStatus={patchTaskStatus}
          />

          {/* Dynamic Pagination Controls */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handleLimitChange}
          />
        </div>
      )}
    </div>
  );
}