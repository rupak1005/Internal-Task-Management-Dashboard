import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '../services/tasks.service';
import { useToast } from '../context/ToastContext';

export function useTasks(initialFilters = {}) {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignee: '',
    search: '',
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    order: 'desc',
    ...initialFilters
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cleanParams = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
          cleanParams[key] = filters[key];
        }
      });

      const response = await tasksService.getTasks(cleanParams);
      setTasks(response.items);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err.message);
      toast.error(`Error loading tasks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 whenever filters other than page change
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (newLimit) => {
    setFilters((prev) => ({ ...prev, limit: Number(newLimit), page: 1 }));
  };

  const handleSortChange = (sortBy, order) => {
    setFilters((prev) => ({ ...prev, sort_by: sortBy, order, page: 1 }));
  };

  const patchTaskStatus = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      await tasksService.patchStatus(taskId, newStatus);
      toast.success(`Task status changed to "${newStatus.replace('_', ' ')}"`);
    } catch (err) {
      toast.error(`Failed to update status: ${err.message}`);
      // Revert via refetch
      fetchTasks();
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await tasksService.deleteTask(taskId);
      toast.success('Task removed successfully');
      fetchTasks();
      return true;
    } catch (err) {
      toast.error(`Failed to delete task: ${err.message}`);
      return false;
    }
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: '',
      search: '',
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      order: 'desc'
    });
  };

  return {
    tasks,
    pagination,
    loading,
    error,
    filters,
    updateFilters,
    handlePageChange,
    handleLimitChange,
    handleSortChange,
    patchTaskStatus,
    deleteTask,
    refetch: fetchTasks,
    resetFilters
  };
}
