import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCommentAlt, FaDoorOpen, FaUsers } from "react-icons/fa";

const CollectionCounts = () => {
  const [doorsCount, setDoorsCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [historiesCount, setHistoriesCount] = useState(null);
  const [todayCount, setTodayCount] = useState(null);
  const [messagesCount, setMessagesCount] = useState(null);
  const [unreadCount, setUnreadCount] = useState(null);
  const [activeDoorsCount, setActiveDoorsCount] = useState(null);

  // Helper function to get today's date in "YYYY-MM-DD" format
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Fetch counts for collections: doors, users, histories
  useEffect(() => {
    const fetchCollectionsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("/api/collections/counts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const data = await response.json();

        const doorsCollection = data.find((collection) => collection.name === "doors");
        const usersCollection = data.find((collection) => collection.name === "users");
        const historiesCollection = data.find((collection) => collection.name === "histories");
        const messagesCollection = data.find((collection) => collection.name === "contactus");

        setDoorsCount(doorsCollection ? doorsCollection.count : 0);
        setUsersCount(usersCollection ? usersCollection.count : 0);
        setHistoriesCount(historiesCollection ? historiesCollection.count : 0);
        setMessagesCount(messagesCollection ? messagesCollection.count : 0);
      } catch (error) {
        console.error("Error fetching collection counts:", error);
      }
    };

    fetchCollectionsCount();
  }, []);

  // Fetch today's access attempts count
  useEffect(() => {
    const fetchTodayCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const todayDate = getTodayDate();
        const response = await fetch(`/api/collections/history?entryTime=${todayDate}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const data = await response.json();
        setTodayCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching today's histories count:", error);
      }
    };

    fetchTodayCount();
  }, []);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/collections/unread-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const data = await response.json();

        console.log("Unread Messages Count:", data.count); // Log the count
        setUnreadCount(data.count || 0); // Update the state with the count
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };
    fetchUnreadMessagesCount();
  }, []);

  // Fetch Active doors count
  useEffect(() => {
    const fetchActiveDoorsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/collections/active-doors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const data = await response.json();

        console.log("Active Doors:", data.count); // Log the count
        setActiveDoorsCount(data.count || 0); // Update the state with the count
      } catch (error) {
        console.error("Error fetching Active doors count:", error);
      }
    };
    fetchActiveDoorsCount();
  }, []);

  return (
    <div>
      {/* Metrics Section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
          <div className="text-blue-500 text-3xl">
            <FaUsers />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-slate-300 text-sm">Total Users</h3>
            <p className="text-2xl font-bold">
              {usersCount !== null ? usersCount : "Loading..."}
            </p>
            {/* <p className="text-green-500 text-sm">#20 new users today</p> */}
          </div>
        </div>

        {/* Active Doors Card */}
        <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
          <div className="text-green-500 text-3xl">
            <FaDoorOpen />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-slate-300 text-sm">Active Doors</h3>
            <p className="text-2xl font-bold">
              {activeDoorsCount !== null ? activeDoorsCount : "Loading..."}
            </p>
            <p className="text-green-500 text-sm">{doorsCount !== null ? doorsCount : "Loading..."} of total doors</p>
          </div>
        </div>

        {/* Access Attempts Card */}
        <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200 rounded-lg shadow-md flex items-center gap-4">
          <div className="text-yellow-500 text-3xl">
            <FaCheckCircle />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-slate-300 text-sm">Access Attempts (24h)</h3>
            <p className="text-2xl font-bold">
              {todayCount !== null ? todayCount : "Loading..."}
            </p>
            <p className="text-yellow-500 text-sm">
              {historiesCount !== null ? historiesCount : "Loading..."} of total Attempts
            </p>
          </div>
        </div>

        {/* Unread Messages Card */}
        <div className="p-4 bg-white dark:bg-slate-600 dark:text-slate-200  rounded-lg shadow-md flex items-center gap-4">
          <div className="text-purple-500 text-3xl">
            <FaCommentAlt />
          </div>
          <div>
            <h3 className="text-gray-600 dark:text-slate-300 text-sm">Unread Messages</h3>
            <p className="text-2xl font-bold">{unreadCount !== null ? unreadCount : "Loading..."}</p>
            <p className=" text-purple-500 text-sm">{messagesCount !== null ? messagesCount : "Loading..."} of total Messages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCounts;