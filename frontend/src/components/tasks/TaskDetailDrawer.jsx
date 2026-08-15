import { useState } from 'react';
import { Modal } from '../common/Modal';
import { PriorityBadge } from '../common/PriorityBadge';
import { CommentSection } from './CommentSection';
import { ActivityFeed } from './ActivityFeed';
import { formatDateTime, getDueDateStatus } from '../../utils/formatters';
import { STATUS_OPTIONS } from '../../utils/constants';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  User,
  Edit2,
  Trash2,
  MessageSquare,
  History
} from 'lucide-react';

export function TaskDetailDrawer({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onPatchStatus,
  onAddComment,
  isLoading = false
}) {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'activity'

  if (!task) return null;

  const dueInfo = getDueDateStatus(task.due_date, task.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            #{task.id}
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
            {task.title}
          </span>
        </div>
      }
      maxWidth="max-w-3xl"
      footer={
        <div className="w-full flex items-center justify-between">
          {isAdmin ? (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => onDelete(task)}
              className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Delete Task
            </Button>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
              Deletion requires Admin role
            </span>
          )}

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Edit2}
              onClick={() => onEdit(task)}
            >
              Edit Details
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status & Priority Control Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 transition-colors">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 mb-1">
                Status
              </div>
              <select
                value={task.status}
                onChange={(e) => onPatchStatus(task.id, e.target.value)}
                className="text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1 text-slate-800 dark:text-slate-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 transition-colors"
              >
                {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
              <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 mb-1">
                Priority
              </div>
              <PriorityBadge priority={task.priority} size="sm" />
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 mb-1">
              Due Deadline
            </div>
            <div className="flex items-center gap-1 text-xs justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span
                className={`font-medium ${
                  dueInfo.variant === 'overdue'
                    ? 'text-rose-600 dark:text-rose-300 font-bold bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 rounded'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {dueInfo.text}
              </span>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Description
          </h4>
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-700/80 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[80px] transition-colors">
            {task.description || (
              <span className="text-slate-400 dark:text-slate-500 italic">
                No description provided for this task.
              </span>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 dark:text-slate-400 text-[11px]">Assigned Member</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {task.assignee_name || 'Unassigned'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 dark:text-slate-400 text-[11px]">Created At</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDateTime(task.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Toggle: Notes vs Activity */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200/80 dark:border-slate-700/80 w-fit">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion Notes ({task.comments?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Activity History ({task.activity?.length || 0})</span>
            </button>
          </div>

          {activeTab === 'notes' ? (
            <CommentSection
              comments={task.comments || []}
              onAddComment={onAddComment}
              isLoading={isLoading}
            />
          ) : (
            <ActivityFeed activity={task.activity || []} />
          )}
        </div>
      </div>
    </Modal>
  );
}