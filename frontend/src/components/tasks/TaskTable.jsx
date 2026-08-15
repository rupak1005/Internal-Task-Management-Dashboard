import { PriorityBadge } from '../common/PriorityBadge';
import { Table } from '../common/Table';
import { getDueDateStatus } from '../../utils/formatters';
import { STATUS_OPTIONS } from '../../utils/constants';
import { MessageSquare, Edit2, Trash2, Eye, Calendar, User } from 'lucide-react';
import { Button } from '../common/Button';

export function TaskTable({
  tasks = [],
  sortField,
  sortOrder,
  onSort,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onPatchStatus,
  className = ''
}) {
  const columns = [
    {
      field: 'title',
      header: 'Task Title',
      sortable: true,
      className: 'font-medium text-slate-900 dark:text-slate-100 max-w-xs sm:max-w-md',
      render: (task) => (
        <div className="space-y-1 py-0.5">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectTask(task.id);
            }}
            className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-1 transition-colors text-sm"
          >
            {task.title}
          </div>
          {task.description && (
            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal">
              {task.description}
            </div>
          )}
        </div>
      )
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      render: (task) => (
        <div onClick={(e) => e.stopPropagation()} className="inline-block relative">
          <select
            value={task.status}
            onChange={(e) => onPatchStatus(task.id, e.target.value)}
            className="text-xs rounded-full font-medium px-3 py-1 border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 cursor-pointer shadow-xs transition-all"
          >
            {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )
    },
    {
      field: 'priority',
      header: 'Priority',
      sortable: true,
      render: (task) => <PriorityBadge priority={task.priority} size="sm" />
    },
    {
      field: 'assigned_to',
      header: 'Assignee',
      sortable: false,
      render: (task) => (
        <div className="flex items-center gap-2">
          {task.assignee_avatar ? (
            <img
              src={task.assignee_avatar}
              alt={task.assignee_name || 'Assignee'}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[10px] font-bold">
              {task.assignee_name ? task.assignee_name.charAt(0) : <User className="w-3 h-3" />}
            </div>
          )}
          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate max-w-[120px]">
            {task.assignee_name || <span className="text-slate-400 dark:text-slate-500 italic">Unassigned</span>}
          </span>
        </div>
      )
    },
    {
      field: 'due_date',
      header: 'Due Deadline',
      sortable: true,
      render: (task) => {
        const dueInfo = getDueDateStatus(task.due_date, task.status);

        if (dueInfo.variant === 'none') {
          return <span className="text-xs text-slate-400 dark:text-slate-500">No deadline</span>;
        }

        return (
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span
              className={`font-medium ${
                dueInfo.variant === 'overdue'
                  ? 'text-rose-600 dark:text-rose-300 font-semibold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800/60'
                  : dueInfo.variant === 'today'
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {dueInfo.text}
            </span>
          </div>
        );
      }
    },
    {
      field: 'comments',
      header: 'Notes',
      sortable: false,
      render: (task) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectTask(task.id);
          }}
          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="font-medium tabular-nums">{task.comments_count || 0}</span>
        </div>
      )
    },
    {
      field: 'actions',
      header: '',
      sortable: false,
      headerClassName: 'text-right',
      className: 'text-right',
      render: (task) => (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectTask(task.id)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="View Details & Discussion"
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditTask(task)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteTask(task)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={tasks}
      sortField={sortField}
      sortOrder={sortOrder}
      onSort={onSort}
      onRowClick={(task) => onSelectTask(task.id)}
      className={className}
    />
  );
}