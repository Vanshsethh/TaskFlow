import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  Kanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import { useSelector } from 'react-redux';

const navItems = [
  {
    name: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'All Tasks',
    to: '/tasks',
    icon: ListTodo
  },
  {
    name: 'Kanban Board',
    to: '/kanban',
    icon: Kanban,
    badge: 'Drag & Drop'
  }
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { stats } = useSelector((state) => state.tasks);

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Navigation links */}
        <div className="space-y-1 px-3 py-4">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick summary stats in sidebar */}
        <div className="px-6 py-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Quick Status
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Pending
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {stats.pending}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                In Progress
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {stats.inProgress}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Completed
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {stats.completed}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workspace Footer info */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          TaskFlow v1.0
        </p>
        <p className="mt-0.5 text-[11px]">Assessment Build • Full Stack</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm min-h-[calc(100vh-4rem)] shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white">
                Navigation
              </span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Sidebar);
