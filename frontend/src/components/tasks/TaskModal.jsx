import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/constants';
import { useUser } from '../../context/UserContext';

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false
}) {
  const { users } = useUser();
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assigned_to: '',
    due_date: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Format ISO date to yyyy-MM-dd for HTML date input
      let formattedDueDate = '';
      if (initialData.due_date) {
        const d = new Date(initialData.due_date);
        if (!isNaN(d.getTime())) {
          formattedDueDate = d.toISOString().split('T')[0];
        }
      }

      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        assigned_to: initialData.assigned_to ? String(initialData.assigned_to) : '',
        due_date: formattedDueDate
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assigned_to: '',
        due_date: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description ? formData.description.trim() : '',
      status: formData.status,
      priority: formData.priority,
      assigned_to: formData.assigned_to ? Number(formData.assigned_to) : null,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      subtitle={isEditing ? 'Update task details and assignments' : 'Add a new assignment to your team workflow'}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <Input
          label="Task Title"
          required
          placeholder="e.g. Implement authentication rate limiting"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
        />

        {/* Description */}
        <Textarea
          label="Description / Context"
          placeholder="Provide background, technical specs, or acceptance criteria..."
          rows={4}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />

        {/* Status & Priority Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Workflow Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <Select
            label="Priority Level"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            {PRIORITY_OPTIONS.filter((o) => o.value).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Assignee & Due Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assignee"
            value={formData.assigned_to}
            onChange={(e) => handleChange('assigned_to', e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </Select>

          <Input
            type="date"
            label="Due Date"
            value={formData.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
