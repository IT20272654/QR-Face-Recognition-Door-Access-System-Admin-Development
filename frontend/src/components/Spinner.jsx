import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center dark:bg-slate-700 h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default Spinner;