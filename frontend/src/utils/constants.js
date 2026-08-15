export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-400/20',
    dotClass: 'bg-slate-400',
    bgLight: 'bg-slate-50',
    borderColor: 'border-slate-300'
  },
  in_progress: {
    label: 'In Progress',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    dotClass: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-300'
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    dotClass: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300'
  },
  blocked: {
    label: 'Blocked',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    dotClass: 'bg-rose-500',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-300'
  }
};

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    iconColor: 'text-slate-400',
    dotClass: 'bg-slate-400'
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-500',
    dotClass: 'bg-amber-500'
  },
  high: {
    label: 'High',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
    iconColor: 'text-orange-500',
    dotClass: 'bg-orange-500'
  },
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20',
    iconColor: 'text-purple-600',
    dotClass: 'bg-purple-600'
  }
};

export const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked', label: 'Blocked' }
];

export const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

export const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest First' },
  { value: 'created_at:asc', label: 'Oldest First' },
  { value: 'due_date:asc', label: 'Due Date (Earliest)' },
  { value: 'due_date:desc', label: 'Due Date (Latest)' },
  { value: 'title:asc', label: 'Title (A-Z)' },
  { value: 'title:desc', label: 'Title (Z-A)' }
];
