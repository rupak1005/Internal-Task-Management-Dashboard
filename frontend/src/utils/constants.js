export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 ring-slate-400/20',
    dotClass: 'bg-slate-400 dark:bg-slate-500',
    bgLight: 'bg-slate-50 dark:bg-slate-900/40',
    borderColor: 'border-slate-300 dark:border-slate-700'
  },
  in_progress: {
    label: 'In Progress',
    badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 ring-blue-500/20',
    dotClass: 'bg-blue-500 dark:bg-blue-400',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-300 dark:border-blue-800'
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 ring-emerald-500/20',
    dotClass: 'bg-emerald-500 dark:bg-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-300 dark:border-emerald-800'
  },
  blocked: {
    label: 'Blocked',
    badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60 ring-rose-500/20',
    dotClass: 'bg-rose-500 dark:bg-rose-400',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-rose-300 dark:border-rose-800'
  }
};

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-400 dark:text-slate-500',
    dotClass: 'bg-slate-400 dark:bg-slate-500'
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    iconColor: 'text-amber-500 dark:text-amber-400',
    dotClass: 'bg-amber-500 dark:bg-amber-400'
  },
  high: {
    label: 'High',
    badgeClass: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60',
    iconColor: 'text-orange-500 dark:text-orange-400',
    dotClass: 'bg-orange-500 dark:bg-orange-400'
  },
  urgent: {
    label: 'Urgent',
    badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60 ring-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    dotClass: 'bg-purple-600 dark:bg-purple-400'
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