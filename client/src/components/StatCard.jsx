import React from 'react';

const colorMap = {
  blue: {
    bg: 'from-blue-500/10 to-indigo-500/10 border-blue-200/60 dark:border-blue-900/40',
    iconBg: 'bg-blue-500 text-white shadow-blue-500/25',
    text: 'text-blue-600 dark:text-blue-400'
  },
  amber: {
    bg: 'from-amber-500/10 to-orange-500/10 border-amber-200/60 dark:border-amber-900/40',
    iconBg: 'bg-amber-500 text-white shadow-amber-500/25',
    text: 'text-amber-600 dark:text-amber-400'
  },
  emerald: {
    bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/60 dark:border-emerald-900/40',
    iconBg: 'bg-emerald-500 text-white shadow-emerald-500/25',
    text: 'text-emerald-600 dark:text-emerald-400'
  },
  purple: {
    bg: 'from-purple-500/10 to-pink-500/10 border-purple-200/60 dark:border-purple-900/40',
    iconBg: 'bg-purple-500 text-white shadow-purple-500/25',
    text: 'text-purple-600 dark:text-purple-400'
  }
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  subtitle,
  onClick
}) => {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 border bg-gradient-to-br ${
        styles.bg
      } bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${styles.iconBg}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(StatCard);
