import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Share2,
  ShieldCheck
} from 'lucide-react';
import {
  fetchTaskByIdAsync,
  updateTaskAsync,
  deleteTaskAsync,
  clearCurrentTask,
  fetchTaskStatsAsync
} from '../store/taskSlice';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const priorityBadges = {
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
};

const TaskDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { currentTask, loading, error } = useSelector((state) => state.tasks);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskByIdAsync(id));
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [dispatch, id]);

  const creatorId = currentTask?.createdBy?._id || currentTask?.createdBy;
  const isCreator =
    currentUser && creatorId && String(creatorId) === String(currentUser._id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      const result = await dispatch(deleteTaskAsync(id));
      if (deleteTaskAsync.fulfilled.match(result)) {
        toast.success('Task deleted successfully');
        dispatch(fetchTaskStatsAsync());
        navigate('/tasks');
      } else {
        toast.error(result.payload || 'Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (currentTask.status === newStatus) return;
    const result = await dispatch(
      updateTaskAsync({ id, taskData: { status: newStatus } })
    );
    if (updateTaskAsync.fulfilled.match(result)) {
      toast.success(`Status updated to "${newStatus}"`);
      dispatch(fetchTaskStatsAsync());
    } else {
      toast.error(result.payload || 'Failed to update status');
    }
  };

  const handleSaveModal = async (formData) => {
    setIsSaving(true);
    try {
      const result = await dispatch(
        updateTaskAsync({ id, taskData: formData })
      );
      if (updateTaskAsync.fulfilled.match(result)) {
        toast.success('Task details updated');
        setIsModalOpen(false);
        dispatch(fetchTaskStatsAsync());
      } else {
        toast.error(result.payload || 'Failed to update task');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading task details..." />;
  }

  if (error || !currentTask) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Task Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
          {error || "The task you're looking for does not exist or has been removed."}
        </p>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Tasks</span>
        </Link>
      </div>
    );
  }

  const dueDateObj = new Date(currentTask.dueDate);
  const formattedDueDate = dueDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to tasks</span>
        </Link>
      </div>

      {/* Main Task Details Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm backdrop-blur-md space-y-6">
        {/* Top Badges and Creator Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                priorityBadges[currentTask.priority] || priorityBadges.Medium
              }`}
            >
              {currentTask.priority} Priority
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              Status: {currentTask.status}
            </span>
          </div>

          {/* Edit / Delete actions */}
          {isCreator ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Task</span>
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>Created by {currentTask.createdBy?.name || 'teammate'}</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {currentTask.title}
        </h1>

        {/* Task Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Description
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            {currentTask.description}
          </p>
        </div>

        {/* Quick Status Updater */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Update Workflow Status
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {['Pending', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  currentTask.status === st
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                }`}
              >
                {st === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                {st === 'In Progress' && <AlertCircle className="w-3.5 h-3.5" />}
                {st === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{st}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Due Date */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              Due Date
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
              <span>{formattedDueDate}</span>
            </div>
          </div>

          {/* Assigned User */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              Assigned To
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <User className="w-4 h-4 text-brand-500 shrink-0" />
              <div className="truncate">
                <span>{currentTask.assignedUser?.name || 'Unassigned'}</span>
                <span className="block text-[11px] font-normal text-slate-400 truncate">
                  {currentTask.assignedUser?.email}
                </span>
              </div>
            </div>
          </div>

          {/* Created By */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              Created By
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
              <div className="truncate">
                <span>{currentTask.createdBy?.name || 'Team member'}</span>
                <span className="block text-[11px] font-normal text-slate-400">
                  {new Date(currentTask.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        task={currentTask}
        isSaving={isSaving}
      />
    </div>
  );
};

export default TaskDetailsPage;
