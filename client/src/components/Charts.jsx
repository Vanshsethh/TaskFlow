import React from 'react';
import { PieChart, BarChart3 } from 'lucide-react';

export const StatusDistributionChart = ({ stats }) => {
  const pending = stats?.pending || 0;
  const inProgress = stats?.inProgress || 0;
  const completed = stats?.completed || 0;
  const total = stats?.total || 0;

  // Compute angles for SVG donut chart
  const p1 = total > 0 ? (pending / total) * 100 : 33.3;
  const p2 = total > 0 ? (inProgress / total) * 100 : 33.3;
  const p3 = total > 0 ? (completed / total) * 100 : 33.3;

  // Circumference for r=40 is 2 * PI * 40 ≈ 251.2
  const C = 251.2;
  const dashPending = (p1 / 100) * C;
  const dashInProgress = (p2 / 100) * C;
  const dashCompleted = (p3 / 100) * C;

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-brand-500" />
          Status Distribution
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Total: {total}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="14"
              fill="transparent"
            />
            {total > 0 ? (
              <>
                {/* Pending (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f59e0b"
                  strokeWidth="14"
                  strokeDasharray={`${dashPending} ${C}`}
                  strokeDashoffset="0"
                  fill="transparent"
                  strokeLinecap="round"
                />
                {/* In Progress (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="14"
                  strokeDasharray={`${dashInProgress} ${C}`}
                  strokeDashoffset={`-${dashPending}`}
                  fill="transparent"
                  strokeLinecap="round"
                />
                {/* Completed (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray={`${dashCompleted} ${C}`}
                  strokeDashoffset={`-${dashPending + dashInProgress}`}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#cbd5e1"
                strokeWidth="14"
                strokeDasharray={`${C} 0`}
                fill="transparent"
              />
            )}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {stats?.completionRate || 0}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase">
              Done
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              Pending
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {pending} ({total > 0 ? Math.round(p1) : 0}%)
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0"></span>
              In Progress
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {inProgress} ({total > 0 ? Math.round(p2) : 0}%)
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
              Completed
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {completed} ({total > 0 ? Math.round(p3) : 0}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PriorityBreakdownChart = ({ stats }) => {
  const low = stats?.priorityBreakdown?.Low || 0;
  const medium = stats?.priorityBreakdown?.Medium || 0;
  const high = stats?.priorityBreakdown?.High || 0;
  const maxVal = Math.max(low, medium, high, 1);

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-500" />
          Priority Breakdown
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Distribution
        </span>
      </div>

      <div className="space-y-4 pt-1">
        {/* High Priority */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              High Priority
            </span>
            <span className="text-slate-700 dark:text-slate-300">{high} tasks</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(high / maxVal) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Medium Priority */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Medium Priority
            </span>
            <span className="text-slate-700 dark:text-slate-300">{medium} tasks</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(medium / maxVal) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Low Priority */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Low Priority
            </span>
            <span className="text-slate-700 dark:text-slate-300">{low} tasks</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(low / maxVal) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
