import React, { useEffect, useState } from 'react';
import { X, Calendar, User, AlertCircle } from 'lucide-react';
import { getUsers } from '../services/userService';
import { useForm } from '../hooks/useForm';

const TaskModal = ({ isOpen, onClose, onSave, task = null, isSaving = false }) => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch registered users for assignment dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setUsersLoading(true);
        try {
          const data = await getUsers();
          setUsers(data.users || []);
        } catch (err) {
          console.error('Failed to load users for assignment:', err);
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  // Initial values helper
  const getInitialValues = () => ({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'Medium',
    status: task?.status || 'Pending',
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedUser: task?.assignedUser?._id || task?.assignedUser || ''
  });

  // Validation function using custom hook pattern
  const validate = (values) => {
    const errors = {};
    if (!values.title || values.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }
    if (!values.description || values.description.trim().length === 0) {
      errors.description = 'Description is required';
    }
    if (!values.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    if (!values.assignedUser) {
      errors.assignedUser = 'Please assign this task to a team member';
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit
  } = useForm(getInitialValues(), validate);

  // Reset form values whenever opened or switching between create / edit
  useEffect(() => {
    if (isOpen) {
      setValues(getInitialValues());
    }
  }, [isOpen, task]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-50 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Implement drag & drop kanban"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                touched.title && errors.title
                  ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {touched.title && errors.title && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Provide context and requirements..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition ${
                touched.description && errors.description
                  ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {touched.description && errors.description && (
              <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={values.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={values.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={values.dueDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    touched.dueDate && errors.dueDate
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                />
              </div>
              {touched.dueDate && errors.dueDate && (
                <p className="mt-1 text-xs text-rose-500">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Assigned User <span className="text-rose-500">*</span>
              </label>
              <select
                name="assignedUser"
                value={values.assignedUser}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  touched.assignedUser && errors.assignedUser
                    ? 'border-rose-400 dark:border-rose-500'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <option value="">Select Assignee...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              {touched.assignedUser && errors.assignedUser && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.assignedUser}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(TaskModal);
