import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GripVertical
} from 'lucide-react';
import { useSelector } from 'react-redux';

const priorityBadges = {
  High: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
};

const statusIcons = {
  Pending: Clock,
  'In Progress': AlertCircle,
  Completed: CheckCircle2
};

const statusBadges = {
  Pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  'In Progress': 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Completed: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
};

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  isDraggable = false,
  onDragStart
}) => {
  const { user: currentUser } = useSelector((state) => state.auth);

  // Check creator permission as per locked decision #4
  const creatorId = task.createdBy?._id || task.createdBy;
  const isCreator = currentUser && creatorId && String(creatorId) === String(currentUser._id);

  // Format Due Date
  const dueDateObj = new Date(task.dueDate);
  const isOverdue =
    task.status !== 'Completed' &&
    dueDateObj < new Date(new Date().setHours(0, 0, 0, 0));
  const formattedDate = dueDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const StatusIcon = statusIcons[task.status] || Clock;

  const handleDrag = (e) => {
    if (onDragStart) {
      onDragStart(e, task);
    }
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDrag}
      className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-xs hover:shadow-md transition-all duration-200 ${
        isDraggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      <div>
        {/* Header: Status, Priority, Drag handle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                statusBadges[task.status] || statusBadges.Pending
              }`}
            >
              <StatusIcon className="w-3 h-3" />
              {task.status}
            </span>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                priorityBadges[task.priority] || priorityBadges.Medium
              }`}
            >
              {task.priority}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            {isDraggable && (
              <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/tasks/${task._id}`}
          className="block font-bold text-slate-900 dark:text-white text-base hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2"
        >
          {task.title}
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
        {/* Assignee & Due Date */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {/* Assigned User */}
          <div
            className="flex items-center gap-1.5 truncate max-w-[140px]"
            title={`Assigned to: ${task.assignedUser?.name || 'Unassigned'}`}
          >
            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <User className="w-3 h-3 text-slate-600 dark:text-slate-300" />
            </div>
            <span className="truncate font-medium text-slate-700 dark:text-slate-300">
              {task.assignedUser?.name || 'Unassigned'}
            </span>
          </div>

          {/* Due Date */}
          <div
            className={`flex items-center gap-1 font-medium ${
              isOverdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Bottom Actions: View details + Edit/Delete if creator */}
        <div className="flex items-center justify-between pt-1">
          <Link
            to={`/tasks/${task._id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition"
          >
            Details
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="flex items-center gap-1">
            {isCreator ? (
              <>
                <button
                  onClick={() => onEdit && onEdit(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Edit task (Creator)"
                  aria-label="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete && onDelete(task._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                  title="Delete task (Creator)"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <span
                className="text-[10px] text-slate-400 dark:text-slate-500 italic"
                title={`Created by ${task.createdBy?.name || 'team member'}`}
              >
                by {task.createdBy?.name?.split(' ')[0] || 'Member'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);
