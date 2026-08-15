export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateString);
}

export function isOverdue(dateString, status) {
  if (!dateString || status === 'completed') return false;
  const date = new Date(dateString);
  return date < new Date();
}

export function getDueDateStatus(dateString, status) {
  if (!dateString) return { text: 'No due date', variant: 'none' };
  if (status === 'completed') return { text: formatDate(dateString), variant: 'completed' };

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      text: `Overdue by ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'}`,
      variant: 'overdue'
    };
  } else if (diffDays === 0) {
    return { text: 'Due today', variant: 'today' };
  } else if (diffDays === 1) {
    return { text: 'Due tomorrow', variant: 'soon' };
  } else if (diffDays <= 3) {
    return { text: `Due in ${diffDays} days`, variant: 'soon' };
  } else {
    return { text: formatDate(dateString), variant: 'future' };
  }
}
