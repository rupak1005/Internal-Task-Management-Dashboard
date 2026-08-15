import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CommentSection } from './CommentSection';
import { formatDate, formatDateTime, getDueDateStatus } from '../../utils/formatters';
import { STATUS_OPTIONS } from '../../utils/constants';
import { Button } from '../common/Button';
import {
  Calendar,
  Clock,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle
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
  if (!task) return null;

  const dueInfo = getDueDateStatus(task.due_date, task.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            #{task.id}
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
            {task.title}
          </span>
        </div>
      }
      maxWidth="max-w-3xl"
      footer={
        <div className="w-full flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => onDelete(task)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            Delete Task
          </Button>

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
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Status</div>
              <select
                value={task.status}
                onChange={(e) => onPatchStatus(task.id, e.target.value)}
                className="text-xs font-semibold rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-l border-slate-200 pl-3">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Priority</div>
              <PriorityBadge priority={task.priority} size="sm" />
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Due Deadline</div>
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span
                className={`font-medium ${
                  dueInfo.variant === 'overdue'
                    ? 'text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded'
                    : 'text-slate-800'
                }`}
              >
                {dueInfo.text}
              </span>
            </div>
          </div>
        </div>

        {/* Task Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Description
          </h4>
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap min-h-[80px]">
            {task.description || (
              <span className="text-slate-400 italic">No description provided for this task.</span>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50/60 border border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Assigned Member</div>
              <div className="font-semibold text-slate-800">
                {task.assignee_name || 'Unassigned'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Created At</div>
              <div className="font-semibold text-slate-800">
                {formatDateTime(task.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Comments & Discussion */}
        <div className="pt-4 border-t border-slate-200">
          <CommentSection
            comments={task.comments || []}
            onAddComment={onAddComment}
            isLoading={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
}
