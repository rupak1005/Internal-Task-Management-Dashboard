import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './KanbanCard';
import { STATUS_CONFIG } from '../../utils/constants';
import { Plus } from 'lucide-react';

export function KanbanColumn({ column, tasks = [], onSelectTask, onOpenCreateTask }) {
  const config = STATUS_CONFIG[column.id] || STATUS_CONFIG.pending;

  return (
    <div className="flex flex-col rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 min-h-[500px] w-full">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            {column.title}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold shadow-xs border border-slate-200/60 dark:border-slate-700 tabular-nums">
            {tasks.length}
          </span>
        </div>

        {onOpenCreateTask && (
          <button
            onClick={() => onOpenCreateTask(column.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Add task to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-3 p-1 rounded-xl transition-colors min-h-[200px] ${
              snapshot.isDraggingOver
                ? 'bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                : ''
            }`}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                onSelectTask={onSelectTask}
              />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400 dark:text-slate-500 text-center p-4">
                Drag tasks here or click + to add
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
