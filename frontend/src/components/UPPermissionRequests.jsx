import axios from 'axios';
import React, { useState } from 'react';

const UPPermissionRequests = ({ pendingRequests, onRequestUpdate }) => {
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const [requests, setRequests] = useState(pendingRequests.filter(request => request.status === 'Pending'));
  const [selectedActions, setSelectedActions] = useState({});

  // Calculate total pages
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  // Get the current page data
  const currentRequests = requests.slice(
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

  // Handler for selecting an action
  const handleSelectAction = (index, action) => {
    setSelectedActions((prevActions) => ({
      ...prevActions,
      [index]: action,
    }));
  };

  // Handler for confirming the action
  const handleConfirmAction = async (indexToConfirm) => {
    const action = selectedActions[indexToConfirm];
    const request = currentRequests[indexToConfirm];

    if (action) {
      try {
        if (action === 'Approve') {
          await axios.put(`/api/permission-requests/${request._id}/approve`);
        } else if (action === 'Reject') {
          await axios.put(`/api/permission-requests/${request._id}/reject`);
        }

        // Remove the request from the list
        const updatedRequests = requests.filter((_, index) => index !== indexToConfirm);
        setRequests(updatedRequests);

        // Adjust current page if it goes out of range after removal
        if (updatedRequests.length > 0 && currentPage >= Math.ceil(updatedRequests.length / itemsPerPage)) {
          setCurrentPage(currentPage - 1);
        }

        // Trigger the state update in the UserProfile component
        onRequestUpdate();
      } catch (error) {
        console.error('Error updating request:', error);
      }
    }
  };

  return (
    <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
      <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-100">Permission Requests</h2>

      {/* Table */}
      <div>
        <table className="w-full mt-4 bg-white dark:bg-slate-700 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="text-left bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-gray-300 dark:border-slate-400">
              <th className="p-3 w-1/6">Door ID</th>
              <th className="p-3 w-1/6">Room Name</th>
              <th className="p-3 w-1/6">Date</th>
              <th className="p-3 w-1/6">Entry Time</th>
              <th className="p-3 w-1/6">Exit Time</th>
              <th className="p-3 w-1/6">Message</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.map((request, index) => {
              const date = new Date(request.date);
              const formattedDate = date.toLocaleDateString('en-CA'); // 'en-CA' locale formats date as yyyy-mm-dd
              return (
                <tr key={index} className={`hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300`}>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">{request.door?.doorCode || 'N/A'}</td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">{request.door?.roomName || 'N/A'}</td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">{formattedDate}</td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">{request.inTime}</td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">{request.outTime}</td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">{request.message}</td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">
                    <div className="flex items-center gap-2">
                      {/* Action Dropdown */}
                      <select
                        value={selectedActions[currentPage * itemsPerPage + index] || ''}
                        onChange={(e) =>
                          handleSelectAction(currentPage * itemsPerPage + index, e.target.value)
                        }
                        className="border dark:border-none px-4 py-1 rounded dark:bg-slate-600 dark:text-slate-300"
                      >
                        <option value="">Select action</option>
                        <option value="Approve">Approve</option>
                        <option value="Reject">Reject</option>
                      </select>

                      {/* Confirm Button */}
                      <button
                        onClick={() => handleConfirmAction(currentPage * itemsPerPage + index)}
                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                      >
                        Confirm
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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

export default UPPermissionRequests;