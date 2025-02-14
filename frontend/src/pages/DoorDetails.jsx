import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Spinner from '../components/Spinner';

const DoorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [door, setDoor] = useState(null);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(approvedRequests.length / itemsPerPage);

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

  const startIndex = currentPage * itemsPerPage;
  const currentItems = approvedRequests.slice(startIndex, startIndex + itemsPerPage);

  const downloadQRCode = () => {
    if (!door || !door.qrImage) {
      alert('No QR Code available to download.');
      return;
    }

    const link = document.createElement('a');
    link.href = door.qrImage; 
    link.download = `${door.doorCode}_${door.roomName}_${door.location}_QR.png`; // Name of the downloaded file
    link.click();
  };

  const handleDeleteDoor = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/doors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      navigate('/doors'); // Redirect to the doors list page after deletion
    } catch (err) {
      console.error('Error deleting door:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchDoor = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/doors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setDoor(response.data.door);
        setApprovedRequests(response.data.approvedRequests);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching door:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDoor();
  }, [id]);

  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload the page to restore the original content
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex bg-white dark:bg-slate-700">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className='p-6 space-y-4'>
          <div className='flex justify-between'>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Door Details</h2>
          </div>

          <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Door Details */}
              <div className="flex-1">
                <p className="text-slate-600 dark:text-slate-100 text-4xl mb-5">
                  <strong>Door Code:</strong> {door.doorCode}
                  <span
                    className={`px-3 py-2 ml-8 rounded text-lg ${
                      door.status === 'Active' ? 'bg-green-700 text-green-100 dark:bg-green-600 dark:text-green-100' : 'bg-red-600 bg-opacity-80 text-red-100 dark:bg-red-600 dark:text-red-100'
                    }`}
                  >
                    {door.status}
                  </span>
                </p>
                <p className="text-slate-600 dark:text-slate-200 mb-2">
                  <strong>Door Name:</strong> {door.roomName}
                </p>
                <p className="text-slate-600 dark:text-slate-200 mb-2">
                  <strong>Location:</strong> {door.location}
                </p>

                <select
                  className="px-2 py-2 mt-4 border dark:border-none dark:bg-slate-800 dark:text-slate-300 rounded"
                  value={door.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value;

                    try {
                      // Update the status in the backend
                      const response = await fetch(`/api/doors/${door._id}/status`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({ status: newStatus }),
                      });

                      if (response.ok) {
                        const updatedDoor = await response.json();

                        // Update the door state with the new status
                        setDoor((prevDoor) => ({
                          ...prevDoor,
                          status: updatedDoor.status,
                        }));
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
              </div>

              {/* QR Code */}
              <div className='flex justify-between'>
                {door.qrImage ? (
                  <div className="">
                    <img
                      src={door.qrImage}
                      alt={`QR Code for ${door.roomName}`}
                      className=" w-48 h-48 p-4 bg-white object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">No QR Code available.</p>
                )}

                <div>
                  <div>
                    <button
                      onClick={handlePrint}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2 w-40 ">
                      Print QR
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={downloadQRCode}
                      className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 dark:hover:bg-green-700 mb-2 w-40">
                      Download QR
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)} // Open the confirmation modal
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-2 w-40">
                      Delete Door
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden section for printing */}
          <div ref={printRef} className="hidden">
            {door.qrImage && (
              <div className="flex justify-center items-center h-screen">
                <img
                  src={door.qrImage}
                  alt={`QR Code for ${door.roomName}`}
                  className="w-48 h-48 p-4 bg-white object-contain"
                />
              </div>
            )}
          </div>

          {/* Approved Permission Requests */}
          <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-100">Approved Permission Requests</h2>
            <div>
              <table className="w-full mt-4 bg-white dark:bg-slate-700 shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="text-left bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-gray-300 dark:border-slate-400">
                    <th className="p-4">User Name</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 ">In Time</th>
                    <th className="p-4 ">Out Time</th>
                    <th className="p-4 w-1/3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((request) => (
                    <tr key={request._id} className="hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <td className="p-3 border-t  border-gray-400 dark:border-slate-500">
                        {request.user.firstName} {request.user.lastName}
                      </td>
                      <td className="p-3 border-t  border-gray-400 dark:border-slate-500">
                        {new Date(request.date).toLocaleDateString('en-CA')}
                      </td>
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
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed': 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
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
                      currentPage === index
                        ? 'bg-blue-700 dark:bg-slate-800 text-white': 'bg-gray-200 dark:bg-slate-500 dark:text-gray-100 text-gray-600 hover:bg-gray-300'
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
                  currentPage === totalPages - 1
                    ? 'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed': 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDoor}
        message="Are you sure you want to delete this door? This action cannot be undone."
      />
    </div>
  );
};

export default DoorDetails;