import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskTable } from '../components/tasks/TaskTable';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { Plus, RefreshCw } from 'lucide-react';

export function TasksPage({
  useTasksHook,
  onOpenCreateTask,
  onEditTask,
  onDeleteTask,
  onSelectTask
}) {
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
    <div className="space-y-6 animate-fade-in">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Task Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {pagination.total} Tasks
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Filter, search, organize, and update team deliverables in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            onClick={onOpenCreateTask}
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

      {/* Task Data Table */}
      {loading && tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
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
          onAction={onOpenCreateTask}
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
