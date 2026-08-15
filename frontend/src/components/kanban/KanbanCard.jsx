import { Draggable } from '@hello-pangea/dnd';
import { PriorityBadge } from '../common/PriorityBadge';
import { getDueDateStatus } from '../../utils/formatters';
import { Calendar, MessageSquare, GripVertical, User } from 'lucide-react';

export function KanbanCard({ task, index, onSelectTask }) {
  const dueInfo = getDueDateStatus(task.due_date, task.status);

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={() => onSelectTask(task.id)}
          className={`p-4 rounded-xl bg-white dark:bg-slate-800 border transition-all select-none cursor-pointer ${
            snapshot.isDragging
              ? 'shadow-xl ring-2 ring-blue-500 border-blue-500 rotate-1 scale-105 z-50'
              : 'border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          {/* Header with Grip & Priority */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <PriorityBadge priority={task.priority} size="xs" />

            <div
              {...provided.dragHandleProps}
              onClick={(e) => e.stopPropagation()}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing p-0.5"
              title="Drag to reorder or change status"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Task Title */}
          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1.5 leading-snug">
            {task.title}
          </h4>

          {/* Task Description snippet */}
          {task.description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Card Footer: Assignee, Due Date & Notes */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[11px]">
            {/* Assignee */}
            <div className="flex items-center gap-1.5 min-w-0">
              {task.assignee_avatar ? (
                <img
                  src={task.assignee_avatar}
                  alt={task.assignee_name || 'Assignee'}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[9px] font-bold">
                  {task.assignee_name ? task.assignee_name.charAt(0) : <User className="w-3 h-3" />}
                </div>
              )}
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[80px]">
                {task.assignee_name ? task.assignee_name.split(' ')[0] : 'Unassigned'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 text-slate-500 dark:text-slate-400">
              {/* Due Date */}
              {dueInfo.variant !== 'none' && (
                <div
                  className={`flex items-center gap-1 font-medium ${
                    dueInfo.variant === 'overdue'
                      ? 'text-rose-600 dark:text-rose-400 font-semibold'
                      : dueInfo.variant === 'today'
                      ? 'text-amber-600 dark:text-amber-400 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{dueInfo.text.replace('Due in ', '').replace('Due ', '')}</span>
                </div>
              )}

              {/* Comments Count */}
              {task.comments_count > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span className="tabular-nums">{task.comments_count}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
