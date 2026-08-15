import React, { useState } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { ExternalUsersPage } from './pages/ExternalUsersPage';
import { TaskModal } from './components/tasks/TaskModal';
import { TaskDetailDrawer } from './components/tasks/TaskDetailDrawer';
import { ConfirmModal } from './components/common/ConfirmModal';
import { useTasks } from './hooks/useTasks';
import { tasksService } from './services/tasks.service';

function DashboardApp() {
  const toast = useToast();
  const tasksHook = useTasks();
  const { refetch: refetchTasks, pagination } = tasksHook;

  // View state
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [drawerTask, setDrawerTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Delete modal states
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // Handlers
  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    try {
      setIsSubmittingTask(true);
      if (editingTask?.id) {
        await tasksService.updateTask(editingTask.id, formData);
        toast.success('Task details updated successfully');
        if (drawerTask?.id === editingTask.id) {
          const fresh = await tasksService.getTaskById(editingTask.id);
          setDrawerTask(fresh);
        }
      } else {
        await tasksService.createTask(formData);
        toast.success('New task created successfully');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      refetchTasks();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setIsDeletingTask(true);
      await tasksService.deleteTask(deletingTask.id);
      toast.success('Task deleted successfully');
      setDeletingTask(null);
      if (isDrawerOpen && drawerTask?.id === deletingTask.id) {
        setIsDrawerOpen(false);
        setDrawerTask(null);
      }
      if (selectedTaskId === deletingTask.id) {
        setSelectedTaskId(null);
        setCurrentTab('tasks');
      }
      refetchTasks();
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setIsDeletingTask(false);
    }
  };

  const handleSelectTask = async (taskId) => {
    try {
      const task = await tasksService.getTaskById(taskId);
      setDrawerTask(task);
      setIsDrawerOpen(true);
    } catch (err) {
      toast.error(`Could not load task: ${err.message}`);
    }
  };

  const handleFilterByStatus = (status, assigneeId = null) => {
    tasksHook.updateFilters({
      status: status || '',
      assignee: assigneeId !== null ? assigneeId : '',
      page: 1
    });
    setCurrentTab('tasks');
  };

  const handleAddCommentToDrawer = async (commentData) => {
    if (!drawerTask) return;
    const newComment = await tasksService.addComment(drawerTask.id, commentData);
    setDrawerTask((prev) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }));
    refetchTasks();
  };

  const handlePatchStatusInDrawer = async (taskId, newStatus) => {
    try {
      setDrawerTask((prev) => ({ ...prev, status: newStatus }));
      await tasksHook.patchTaskStatus(taskId, newStatus);
    } catch (err) {
      // Handled in hook
    }
  };

  return (
    <Layout
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setCurrentTab(tab);
        setSelectedTaskId(null);
      }}
      counts={{ total: pagination.total }}
      onOpenCreateTask={handleOpenCreateTask}
    >
      {/* Page Switching */}
      {selectedTaskId ? (
        <TaskDetailPage
          taskId={selectedTaskId}
          onBack={() => setSelectedTaskId(null)}
          onEdit={(task) => handleOpenEditTask(task)}
          onDelete={(task) => setDeletingTask(task)}
          onPatchStatus={tasksHook.patchTaskStatus}
        />
      ) : currentTab === 'dashboard' ? (
        <DashboardPage
          onSelectTab={setCurrentTab}
          onSelectTask={handleSelectTask}
          onOpenCreateTask={handleOpenCreateTask}
          onFilterByStatus={handleFilterByStatus}
        />
      ) : currentTab === 'tasks' ? (
        <TasksPage
          useTasksHook={tasksHook}
          onOpenCreateTask={handleOpenCreateTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={(task) => setDeletingTask(task)}
          onSelectTask={handleSelectTask}
        />
      ) : currentTab === 'external-users' ? (
        <ExternalUsersPage />
      ) : null}

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        isLoading={isSubmittingTask}
      />

      {/* Task Detail Drawer / Modal */}
      <TaskDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerTask(null);
        }}
        task={drawerTask}
        onEdit={(task) => {
          setIsDrawerOpen(false);
          handleOpenEditTask(task);
        }}
        onDelete={(task) => setDeletingTask(task)}
        onPatchStatus={handlePatchStatusInDrawer}
        onAddComment={handleAddCommentToDrawer}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently remove "${deletingTask?.title}"? All associated comments and activity will be removed.`}
        confirmText="Delete Task"
        variant="danger"
        isLoading={isDeletingTask}
      />
    </Layout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <DashboardApp />
      </UserProvider>
    </ToastProvider>
  );
}
