import { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { useToast } from '../../context/ToastContext';

const COLUMNS = [
  { id: 'pending', title: 'Pending Pickup' },
  { id: 'in_progress', title: 'In Active Progress' },
  { id: 'blocked', title: 'Blocked' },
  { id: 'completed', title: 'Completed' }
];

export function KanbanBoard({
  tasks = [],
  onPatchStatus,
  onSelectTask,
  onOpenCreateTask,
  className = ''
}) {
  const toast = useToast();
  const [columnsData, setColumnsData] = useState({});

  // Sync props to local columns
  useEffect(() => {
    const grouped = {
      pending: [],
      in_progress: [],
      blocked: [],
      completed: []
    };

    tasks.forEach((task) => {
      const status = task.status || 'pending';
      if (grouped[status]) {
        grouped[status].push(task);
      } else {
        grouped.pending.push(task);
      }
    });

    setColumnsData(grouped);
  }, [tasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    const taskId = Number(draggableId);

    // Save previous snapshot for rollback
    const prevColumns = { ...columnsData };

    // Move task optimistically
    const sourceList = [...(columnsData[sourceColId] || [])];
    const destList = sourceColId === destColId ? sourceList : [...(columnsData[destColId] || [])];

    const [movedTask] = sourceList.splice(source.index, 1);
    if (!movedTask) return;

    const updatedTask = { ...movedTask, status: destColId };
    destList.splice(destination.index, 0, updatedTask);

    setColumnsData({
      ...columnsData,
      [sourceColId]: sourceList,
      [destColId]: destList
    });

    // If status changed, trigger API request
    if (sourceColId !== destColId) {
      try {
        await onPatchStatus(taskId, destColId);
        toast.success(`Task moved to "${destColId.replace('_', ' ')}"`);
      } catch (err) {
        // Rollback state on error
        setColumnsData(prevColumns);
        toast.error(`Failed to update status: ${err.message}`);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start ${className}`}>
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={columnsData[col.id] || []}
            onSelectTask={onSelectTask}
            onOpenCreateTask={onOpenCreateTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
