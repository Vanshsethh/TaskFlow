import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { StatusDistributionChart, PriorityBreakdownChart } from '../components/Charts';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchTaskStatsAsync,
  fetchTasksAsync,
  createTaskAsync,
  updateTaskAsync,
  deleteTaskAsync
} from '../store/taskSlice';
import { useToast } from '../context/ToastContext';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { stats, tasks, loading, statsLoading } = useSelector(
    (state) => state.tasks
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadDashboardData = useCallback(() => {
    dispatch(fetchTaskStatsAsync());
    dispatch(fetchTasksAsync({ limit: 4, sort: 'createdAt:desc' }));
  }, [dispatch]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // UseMemo to compute quick user insight greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

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
        } else {
          toast.error(result.payload || 'Failed to update task');
        }
      } else {
        const result = await dispatch(createTaskAsync(formData));
        if (createTaskAsync.fulfilled.match(result)) {
          toast.success('Task created successfully');
          setIsModalOpen(false);
          dispatch(fetchTaskStatsAsync());
        } else {
          toast.error(result.payload || 'Failed to create task');
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span>
              {greeting}, {user?.name?.split(' ')[0] || 'Team Member'}
            </span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what is happening across your projects and workspace today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadDashboardData}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh dashboard metrics"
            aria-label="Refresh dashboard metrics"
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

      {/* Metric Cards (Spec Section 2: Total / Pending / Completed / In Progress) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={CheckSquare}
          color="purple"
          subtitle={`${stats.completionRate}% completion rate`}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          icon={Clock}
          color="amber"
          subtitle="Awaiting action"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={AlertCircle}
          color="blue"
          subtitle="Currently active"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Successfully done"
        />
      </div>

      {/* Bonus: Visual Charts (Status Donut & Priority Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <StatusDistributionChart stats={stats} />
        <PriorityBreakdownChart stats={stats} />
      </div>

      {/* Recent Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Workspace Tasks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest activities across the team
            </p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition group"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading && tasks.length === 0 ? (
          <LoadingSpinner text="Loading recent tasks..." />
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <CheckSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No tasks found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Get started by creating your first team task.
            </p>
            <button
              onClick={handleCreateNew}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

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

export default DashboardPage;
