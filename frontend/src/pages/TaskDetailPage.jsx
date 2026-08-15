import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '../services/tasks.service';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CommentSection } from '../components/tasks/CommentSection';
import { Skeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { formatDateTime, getDueDateStatus } from '../utils/formatters';
import { STATUS_OPTIONS } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Clock,
  User,
  Edit2,
  Trash2
} from 'lucide-react';

export function TaskDetailPage({
  taskId,
  onBack,
  onEdit,
  onDelete,
  onPatchStatus
}) {
  const toast = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tasksService.getTaskById(taskId);
      setTask(data);
    } catch (err) {
      toast.error(`Failed to load task: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [taskId, toast]);

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId, fetchTask]);

  const handleAddComment = async (commentData) => {
    const newComment = await tasksService.addComment(taskId, commentData);
    setTask((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }));
    toast.success('Comment added successfully');
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setTask((prev) => ({ ...prev, status: newStatus }));
      await tasksService.patchStatus(taskId, newStatus);
      if (onPatchStatus) onPatchStatus(taskId, newStatus);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      toast.error(`Status update failed: ${err.message}`);
      fetchTask();
    }
  };

  if (loading && !task) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-slate-800">Task Not Found</h3>
        <p className="text-sm text-slate-500 mt-1">This task may have been removed.</p>
        <Button variant="secondary" icon={ArrowLeft} onClick={onBack} className="mt-4">
          Back to Tasks
        </Button>
      </div>
    );
  }

  const dueInfo = getDueDateStatus(task.due_date, task.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
          Back to Task Backlog
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Edit2}
            onClick={() => onEdit(task)}
          >
            Edit Task
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => onDelete(task)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
            TASK #{task.id}
          </span>
          <StatusBadge status={task.status} size="md" />
          <PriorityBadge priority={task.priority} size="md" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
          {task.title}
        </h1>

        {/* Status Switcher & Date Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase">Change Status:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-semibold rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Deadline:</span>
            <span
              className={`font-semibold ${
                dueInfo.variant === 'overdue'
                  ? 'text-rose-600 bg-rose-100 px-2 py-0.5 rounded'
                  : 'text-slate-800'
              }`}
            >
              {dueInfo.text}
            </span>
          </div>
        </div>

        {/* Task Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Description & Acceptance Criteria
          </h3>
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200/60 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
            {task.description || (
              <span className="text-slate-400 italic">No description provided.</span>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            {task.assignee_avatar ? (
              <img
                src={task.assignee_avatar}
                alt={task.assignee_name || 'Assignee'}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {task.assignee_name ? task.assignee_name.charAt(0) : <User className="w-4 h-4" />}
              </div>
            )}
            <div>
              <div className="text-slate-400">Assignee</div>
              <div className="font-semibold text-slate-800 text-sm">
                {task.assignee_name || 'Unassigned'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400">Created Timestamp</div>
              <div className="font-semibold text-slate-800 text-sm">
                {formatDateTime(task.created_at)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Comments Thread */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <CommentSection
          comments={task.comments || []}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  );
}
