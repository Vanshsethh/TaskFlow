import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  fetchTasksAsync,
  createTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  optimisticUpdateTaskStatus,
  fetchTaskStatsAsync
} from '../store/taskSlice';
import { useToast } from '../context/ToastContext';

const COLUMNS = [
  {
    id: 'Pending',
    title: 'Pending',
    icon: Clock,
    color: 'border-amber-400 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    headerBg: 'bg-amber-50 dark:bg-amber-950/30'
  },
  {
    id: 'In Progress',
    title: 'In Progress',
    icon: AlertCircle,
    color: 'border-blue-400 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    headerBg: 'bg-blue-50 dark:bg-blue-950/30'
  },
  {
    id: 'Completed',
    title: 'Completed',
    icon: CheckCircle2,
    color: 'border-emerald-400 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/30'
  }
];

const KanbanPage = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { tasks, loading } = useSelector((state) => state.tasks);

  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [activeDropColumn, setActiveDropColumn] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState('Pending');
  const [isSaving, setIsSaving] = useState(false);

  // Load all tasks for Kanban board
  const loadKanbanTasks = useCallback(() => {
    dispatch(fetchTasksAsync({ all: true, sort: 'createdAt:desc' }));
  }, [dispatch]);

  useEffect(() => {
    loadKanbanTasks();
  }, [loadKanbanTasks]);

  // Filter tasks locally by search query if user types in search
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  // Group tasks by column
  const columnTasks = useMemo(() => {
    const map = {
      Pending: [],
      'In Progress': [],
      Completed: []
    };
    filteredTasks.forEach((t) => {
      if (map[t.status]) {
        map[t.status].push(t);
      } else {
        map.Pending.push(t);
      }
    });
    return map;
  }, [filteredTasks]);

  // Drag and Drop handlers
  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(task._id);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropColumn !== columnId) {
      setActiveDropColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (activeDropColumn === columnId) {
      setActiveDropColumn(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setActiveDropColumn(null);

    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === targetStatus) return;

    // Optimistic Update in UI
    dispatch(optimisticUpdateTaskStatus({ id: taskId, status: targetStatus }));
    toast.info(`Task status moved to "${targetStatus}"`);

    // Server-side persist
    const result = await dispatch(
      updateTaskAsync({ id: taskId, taskData: { status: targetStatus } })
    );

    if (updateTaskAsync.fulfilled.match(result)) {
      dispatch(fetchTaskStatsAsync());
    } else {
      toast.error(result.payload || 'Failed to update task status');
      // Revert if error
      loadKanbanTasks();
    }
  };

  const handleCreateInColumn = (status) => {
    setDefaultStatusForNew(status);
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Kanban Board
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-500" />
              Drag & Drop Bonus
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag cards horizontally between columns to update task progress in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kanban..."
              className="pl-9 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={loadKanbanTasks}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh board"
            aria-label="Refresh board"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && tasks.length === 0 ? (
        <LoadingSpinner text="Loading Kanban columns..." />
      ) : (
        /* Kanban Columns Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map((col) => {
            const ColumnIcon = col.icon;
            const currentTasks = columnTasks[col.id] || [];
            const isColumnActive = activeDropColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex flex-col rounded-2xl border transition-all duration-200 min-h-[550px] bg-slate-100/60 dark:bg-slate-900/40 ${
                  isColumnActive
                    ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20 dark:bg-brand-950/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between p-4 rounded-t-2xl border-b border-slate-200/80 dark:border-slate-800 ${col.headerBg}`}
                >
                  <div className="flex items-center gap-2">
                    <ColumnIcon className="w-4 h-4" />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {col.title}
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 shadow-2xs">
                      {currentTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCreateInColumn(col.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition"
                    title={`Add task in ${col.title}`}
                    aria-label={`Add task in ${col.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Column Body / Cards List */}
                <div className="flex-1 p-3 space-y-3.5 overflow-y-auto">
                  {currentTasks.length === 0 ? (
                    <div
                      className={`h-32 flex flex-col items-center justify-center rounded-xl border border-dashed text-xs text-slate-400 transition-colors ${
                        isColumnActive
                          ? 'border-brand-400 text-brand-600 bg-brand-50/30 dark:bg-brand-950/30'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>Drag tasks here</span>
                    </div>
                  ) : (
                    currentTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        isDraggable={true}
                        onDragStart={handleDragStart}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={
          selectedTask || {
            status: defaultStatusForNew,
            priority: 'Medium'
          }
        }
        isSaving={isSaving}
      />
    </div>
  );
};

export default KanbanPage;
