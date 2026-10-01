import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import TaskModal from './TaskModal';
import { createTaskAsync, fetchTaskStatsAsync, fetchTasksAsync } from '../store/taskSlice';
import { useToast } from '../context/ToastContext';

const Layout = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateTask = async (formData) => {
    setIsSaving(true);
    try {
      const result = await dispatch(createTaskAsync(formData));
      if (createTaskAsync.fulfilled.match(result)) {
        toast.success('Task created successfully');
        setIsNewTaskModalOpen(false);
        dispatch(fetchTaskStatsAsync());
        dispatch(fetchTasksAsync());
      } else {
        toast.error(result.payload || 'Failed to create task');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Global New Task Modal */}
      <TaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSave={handleCreateTask}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Layout;
