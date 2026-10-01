import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Plus,
  RefreshCw,
  CheckSquare,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import TaskFilterBar from '../components/TaskFilterBar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../context/ToastContext';
import {
  fetchTasksAsync,
  createTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  setFilter,
  resetFilters,
  setPage,
  fetchTaskStatsAsync
} from '../store/taskSlice';

const TasksPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { tasks, loading, pagination, filters } = useSelector(
    (state) => state.tasks
  );

  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Debounce search query to prevent spamming server
  const debouncedSearch = useDebounce(filters.search, 400);

  // Fetch tasks with server-side query params (Locked Decision #7)
  const loadTasks = useCallback(() => {
    const params = {
      page: pagination.currentPage,
      limit: pagination.limit,
      sort: filters.sort
    };
    if (debouncedSearch && debouncedSearch.trim() !== '') {
      params.search = debouncedSearch.trim();
    }
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    if (filters.priority && filters.priority !== 'all') {
      params.priority = filters.priority;
    }

    dispatch(fetchTasksAsync(params));
  }, [
    dispatch,
    pagination.currentPage,
    pagination.limit,
    filters.sort,
    filters.status,
    filters.priority,
    debouncedSearch
  ]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleCreateNew = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await dispatch(deleteTaskAsync(id));
      if (deleteTaskAsync.fulfilled.match(result)) {
        toast.success('Task deleted successfully');
        dispatch(fetchTaskStatsAsync());
        loadTasks();
      } else {
        toast.error(result.payload || 'Failed to delete task');
      }
    }
  };

  const handleSaveTask = async (formData) => {
    setIsSaving(true);
    try {
      if (selectedTask) {
        const result = await dispatch(
          updateTaskAsync({ id: selectedTask._id, taskData: formData })
        );
        if (updateTaskAsync.fulfilled.match(result)) {
          toast.success('Task updated successfully');
          setIsModalOpen(false);
          dispatch(fetchTaskStatsAsync());
          loadTasks();
        } else {
          toast.error(result.payload || 'Failed to update task');
        }
      } else {
        const result = await dispatch(createTaskAsync(formData));
        if (createTaskAsync.fulfilled.match(result)) {
          toast.success('Task created successfully');
          setIsModalOpen(false);
          dispatch(fetchTaskStatsAsync());
          loadTasks();
        } else {
          toast.error(result.payload || 'Failed to create task');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All Workspace Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, filter, search, and manage tasks across your entire organization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadTasks}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh tasks"
            aria-label="Refresh tasks"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm hover:shadow transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <TaskFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Task Content: Grid or Table List */}
      {loading ? (
        <LoadingSpinner text="Fetching tasks..." />
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No tasks match your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, changing the active filters, or creating a new task.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      ) : (
        /* Table List View */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Task</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tasks.map((task) => {
                const creatorId = task.createdBy?._id || task.createdBy;
                const isCreator =
                  currentUser &&
                  creatorId &&
                  String(creatorId) === String(currentUser._id);

                return (
                  <tr
                    key={task._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="hover:text-brand-600 dark:hover:text-brand-400 transition"
                      >
                        {task.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      {task.assignedUser?.name || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/tasks/${task._id}`}
                          className="p-1 rounded text-slate-400 hover:text-brand-600 transition"
                          title="View Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {isCreator && (
                          <>
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                              title="Edit Task"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (Bonus Feature!) */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={handlePageChange}
      />

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        isSaving={isSaving}
      />
    </div>
  );
};

export default TasksPage;
