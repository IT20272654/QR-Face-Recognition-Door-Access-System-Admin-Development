import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

const DoorSection = ({ doors, setDoors }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 6;
  const navigate = useNavigate();

  // Filter doors based on the search query and status filter
  const filteredDoors = doors.filter((door) => {
    const matchesSearchQuery =
      door.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      door.doorCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatusFilter =
      statusFilter === 'All' || door.status === statusFilter;

    return matchesSearchQuery && matchesStatusFilter;
  });

  // Calculate total pages after filtering
  const totalPages = Math.ceil(filteredDoors.length / itemsPerPage);

  // Get the current page doors
  const currentDoors = filteredDoors.slice(
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to the first page when searching
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(0); // Reset to the first page when filtering
  };

  return (
    <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold dark:text-slate-100">Doors</h2>

      
      <div className="flex items-center gap-2">
      <input
          type="text"
          placeholder="Search by Room Name or Door Code"
          value={searchQuery}
          onChange={handleSearch}
          className="border dark:border-none px-4 py-2 rounded w-80 dark:bg-slate-700 dark:text-slate-100"
        />

      <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border dark:border-none px-4 py-2 rounded dark:bg-slate-700 dark:text-slate-300">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
      </select>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/create-door')}
        >
          Add new Door
        </button>


      </div>
       
      </div>

      {/* Door List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentDoors.map((door) => (
          <div key={door._id} className={`p-4 border dark:border-none rounded-lg shadow-sm ${
                  door.status === "Active" ? "bg-slate-50 dark:bg-slate-700" : "bg-red-50 dark:bg-red-950 dark:bg-opacity-30"
                }`}>
            <div className="flex py-1 justify-between items-center text-slate-700 dark:text-gray-200 mb-2">
              <h3 className="text-lg font-semibold">{door.roomName}</h3>
              <h3 className="text-lg font-semibold">{door.doorCode}</h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  door.status === 'Active' ? 'bg-green-700 text-green-100 dark:bg-green-600 dark:text-green-100' : 'bg-red-600 bg-opacity-80 text-red-100 dark:bg-red-600 dark:text-red-100'
                }`}
              >
                {door.status}
              </span>

              
            </div>
            
            <div className="flex py-1 items-center justify-between">
              <button
                onClick={() => navigate(`/doors/${door._id}`)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Details 
              </button>
              <span>
              <select
                className="px-2 py-1 border dark:border-none dark:bg-slate-800 dark:text-slate-300 rounded"
                value={door.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;

                  try {
                    // Update the status in the backend
                    const response = await fetch(`/api/doors/${door._id}/status`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ status: newStatus }),
                    });

                    if (response.ok) {
                      const updatedDoor = await response.json();

                      // Update the doors state
                      setDoors((prevDoors) =>
                        prevDoors.map((d) =>
                          d._id === updatedDoor._id ? updatedDoor : d
                        )
                      );
                    } else {
                      console.error('Failed to update status');
                    }
                  } catch (error) {
                    console.error('Error updating status:', error);
                  }
                }}
              >
                <option disabled>Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              </span>
            </div>
          </div>
        ))}
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

        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`px-3 py-1 rounded ${
                index === currentPage ? 'bg-blue-700 dark:bg-slate-800 text-white' : 'bg-gray-200 dark:bg-slate-500 dark:text-gray-100 text-gray-600 hover:bg-gray-300'
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

      {/* No Results Message */}
      {filteredDoors.length === 0 && (
        <div className="mt-4 text-center text-gray-500 dark:text-white">
          No doors found matching your search.
        </div>
      )}
    </div>
  );
};

export default DoorSection;
