import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/permission-requests/pending-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        // Sort the requests by requestTime in descending order
        const sortedRequests = response.data.sort(
          (a, b) => new Date(b.requestTime) - new Date(a.requestTime)
        );
        setRequests(sortedRequests);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, []);

  return (
    <div>
      {requests.length > 0 ? (
        <div className="max-h-96 overflow-y-auto  [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:rounded-full
                      [&::-webkit-scrollbar-track]:bg-gray-100
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                      dark:[&::-webkit-scrollbar-track]:bg-slate-800
                      dark:[&::-webkit-scrollbar-thumb]:bg-slate-500">
          <ul>
            {requests.map((request) => {
              // Format the date and time
              const requestDate = new Date(request.requestTime);
              const date = requestDate.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
              const time = requestDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false, // 24-hour format
              });

              return (
                <Link
                  to={`/users/${request.user._id}`}
                  key={request._id}
                  className="block bg-slate-100 p-4 rounded-lg hover:bg-slate-200 mb-2 dark:bg-slate-700 dark:hover:bg-slate-800 dark:text-slate-300"
                >
                  <div className="flex justify-between">
                    <h2 className="text-md font-semibold text-slate-700 dark:text-slate-100">
                      {request.user.firstName} {request.user.lastName} ({request.user.userId})
                    </h2>
                    <p className="text-yellow-500 font-bold mt-2">{request.status}</p>
                  </div>
                  <p>
                    <strong>Door :</strong> {request.door.doorCode} - {request.door.roomName}
                  </p>
                  <p>
                    <strong>Location :</strong> {request.door.location}
                  </p>
                  <p>
                    <strong>Message :</strong> {request.message}
                  </p>
                  <p>
                    <strong>Requested Date :</strong> {date} {time}
                  </p>
                </Link>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">No pending requests found.</p>
      )}
    </div>
  );
};

export default PendingRequests;
