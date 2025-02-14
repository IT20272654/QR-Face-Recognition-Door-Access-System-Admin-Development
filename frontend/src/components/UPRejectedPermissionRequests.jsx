import React, { useEffect, useState } from 'react';

const UPRejectedPermissionRequests = ({ rejectedRequests }) => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const [records, setRecords] = useState(rejectedRequests);

  useEffect(() => {
    setRecords(rejectedRequests);
  }, [rejectedRequests]);

  // Calculate total pages
  const totalPages = Math.ceil(records.length / itemsPerPage);

  // Get the current page data
  const currentRecords = records.slice(
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

  return (
    <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-100">Rejected Requests</h2>

      <div>
        <table className="w-full mt-4 bg-white dark:bg-slate-700 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-gray-300 dark:border-slate-400">
              <th className="p-4">Door Code</th>
              <th className="p-4">Room Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Date</th>
              <th className="p-4">Entry Time</th>
              <th className="p-4">Exit Time</th>
              <th className="p-4">Message</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((request, index) => (
              <tr key={index} className="hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{request.door?.doorCode || 'N/A'}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{request.door?.roomName || 'N/A'}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{request.door?.location || 'N/A'}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{new Date(request.date).toLocaleDateString('en-CA')}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{request.inTime}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{request.outTime}</td>
                <td className="p-3 border-t  border-gray-400 dark:border-slate-500">{request.message}</td>
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

export default UPRejectedPermissionRequests;