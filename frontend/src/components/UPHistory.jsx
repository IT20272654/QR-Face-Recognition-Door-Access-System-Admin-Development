import React, { useState } from 'react';

const UPHistory = ({ historyRecords }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate total pages
  const totalPages = Math.ceil(historyRecords.length / itemsPerPage);

  // Get the current page data
  const currentRecords = historyRecords.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  // Handlers for pagination
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  // Helper function to calculate duration
  const calculateDuration = (entryTime, exitTime) => {
    if (!exitTime) return 'Ongoing';
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const durationMs = exit - entry;

    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);

    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
  };

  return (
    <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-100">Door Accessed History</h2>

      {/* Table */}
      <div>
        <table className="w-full mt-4 bg-white dark:bg-slate-700 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-gray-300 dark:border-slate-400">
              <th className="p-4 w-1/8">Door Code</th>
              <th className="p-4 w-1/5">Room Name</th>
              <th className="p-4 w-1/5">Entry Time</th>
              <th className="p-4 w-1/5">Exit Time</th>
              <th className="p-4 w-1/6">Duration</th>
              <th className="p-4 ">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={index} className="hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{record.doorCode}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{record.roomName}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{new Date(record.entryTime).toLocaleString()}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{record.exitTime ? new Date(record.exitTime).toLocaleString() : 'Still in the Room'}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">
                  {calculateDuration(record.entryTime, record.exitTime)}
                </td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      record.exitTime
                        ? 'bg-red-100 dark:bg-red-400 text-red-700 dark:text-red-100'
                        : 'bg-green-100 dark:bg-green-400 text-green-700 dark:text-green-100'
                    }`}
                  >
                    {record.exitTime ? 'Exited' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${
            currentPage === 0 ? 'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed' : 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`px-3 py-1 rounded ${
                currentPage === index ? 'bg-blue-700 dark:bg-slate-800 text-white' : 'bg-gray-200 dark:bg-slate-500 dark:text-gray-100 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages - 1 ? 'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed' : 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UPHistory;