import React, { useEffect, useState } from 'react';
import { FaBuilding, FaCheckCircle, FaCommentAlt, FaDoorOpen, FaUsers, FaUserShield } from "react-icons/fa";

const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalUsersCount: (null),
    totalAdminUsersCount: (null),
    totalCompaniesCount: (null),
    totalDoorsCount:(null),
    totalHistoriesCount:(null),
    totalMessagesCount:(null),
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/dashboard/metrics', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Users Card */}
      <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
        <div className="text-blue-500 text-3xl">
          <FaUsers />
        </div>
        <div>
          <h3 className="text-gray-600 dark:text-slate-300 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{metrics.totalUsersCount !== null ? metrics.totalUsersCount : "Loading..."}</p>
        </div>
      </div>

      {/* Total Admin Users Card */}
      <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
        <div className="text-cyan-500 text-3xl">
          <FaUserShield />
        </div>
        <div>
          <h3 className="text-gray-600 dark:text-slate-300 text-sm">Total Admin Users</h3>
          <p className="text-2xl font-bold">{metrics.totalAdminUsersCount !== null ? metrics.totalAdminUsersCount : "Loading..."}</p>
        </div>
      </div>

      {/* Total Companies Card */}
      <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
        <div className="text-orange-500 text-3xl">
          <FaBuilding />
        </div>
        <div>
          <h3 className="text-gray-600 dark:text-slate-300 text-sm">Total Companies</h3>
          <p className="text-2xl font-bold">{metrics.totalCompaniesCount !== null ? metrics.totalCompaniesCount : "Loading..."}</p>
        </div>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
       {/* Active Doors Card */}
        <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
          <div className="text-green-500 text-3xl">
            <FaDoorOpen />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-slate-300 text-sm">Total Doors</h3>
            <p className="text-2xl font-bold">{metrics.totalDoorsCount !== null ? metrics.totalDoorsCount : "Loading..."}</p>
           </div>
        </div>

        {/* Total Access Attempts */}
        <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
          <div className="text-yellow-500 text-3xl">
            <FaCheckCircle />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-slate-300 text-sm">Total Access Attempts</h3>
            <p className="text-2xl font-bold">{metrics.totalHistoriesCount !== null ? metrics.totalHistoriesCount : "Loading..."}</p>
           </div>
        </div>

        {/* Total Messages Card */}
        <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
          <div className="text-purple-500 text-3xl">
            <FaCommentAlt />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-slate-300 text-sm">Total Messages</h3>
            <p className="text-2xl font-bold">{metrics.totalMessagesCount !== null ? metrics.totalMessagesCount : "Loading..."}</p>
           </div>
        </div>

    </div>
    </div>
  );
};

export default DashboardMetrics;