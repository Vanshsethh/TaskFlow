/**
 * TaskFlow Formatting Utilities
 */

/**
 * Format date string into human-readable format
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  });
};

/**
 * Check if a task is overdue
 */
export const isTaskOverdue = (dueDate, status) => {
  if (status === 'Completed' || !dueDate) return false;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
};

/**
 * Extract 2-letter uppercase initials from full name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
