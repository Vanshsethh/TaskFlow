import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default React.memo(LoadingSpinner);
