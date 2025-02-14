import React, { useState } from "react";
import {
  FaCog,
  FaDoorOpen,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { clearAuthData } from '../utils/auth';

const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role'); // Assuming you store the role in localStorage

  const handleLogout = () => {
    // Clear local storage
    clearAuthData();
    // Perform any other logout logic here (e.g., clearing session)
    console.log("Logging out...");
    navigate("/logout"); // Redirect to the logout page
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <aside className="w-64 bg-slate-200 dark:bg-slate-800 min-h-screen p-6 flex flex-col">
      <div className="flex justify-center mb-2">
        <NavLink to="/dashboard">
          <img src={logo} alt="Logo" className="" />
        </NavLink>
      </div>
      <nav className="flex-1">
        <ul className="space-y-6">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? " text-blue-600 flex items-center gap-4 dark:text-blue-400"
                  : "text-gray-600 flex items-center gap-2 dark:text-slate-400"
              }
            >
              <FaHome /> Dashboard
            </NavLink>
          </li>
          {userRole !== 'SuperAdmin' && (
            <>
              <li>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    isActive
                      ? " text-blue-600 flex items-center gap-4 dark:text-blue-400"
                      : "text-gray-600 flex items-center gap-2 dark:text-slate-400"
                  }
                >
                  <FaUserFriends /> Users List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/doors"
                  className={({ isActive }) =>
                    isActive
                      ? " text-blue-600 flex items-center gap-4 dark:text-blue-400"
                      : "text-gray-600 flex items-center gap-2 dark:text-slate-400"
                  }
                >
                  <FaDoorOpen /> Doors
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive
                      ? " text-blue-600 flex items-center gap-4 dark:text-blue-400"
                      : "text-gray-600 flex items-center gap-2 dark:text-slate-400"
                  }
                >
                  <FaCog /> Settings
                </NavLink>
              </li> */}
            </>
          )}
          {userRole === 'SuperAdmin' && (
            <>
              <li>
                <NavLink
                  to="/companies"
                  className={({ isActive }) =>
                    isActive
                      ? " text-blue-600 flex items-center gap-4 dark:text-blue-400"
                  : "text-gray-600 flex items-center gap-2 dark:text-slate-400"
                  }
                >
                  <FaUserFriends /> Companies
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin-users"
                  className={({ isActive }) =>
                    isActive
                      ? " text-blue-600 flex items-center gap-4 dark:text-blue-400"
                  : "text-gray-600 flex items-center gap-2 dark:text-slate-400"
                  }
                >
                  <FaUser /> Admins
                </NavLink>
              </li>
            </>
          )}
          <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    isActive
                      ? " text-blue-600 flex items-center gap-4 dark:text-blue-400"
                      : "text-gray-600 flex items-center gap-2 dark:text-slate-400"
                  }
                >
                  <FaCog /> Settings
                </NavLink>
              </li>
          <li>
            <button
              onClick={confirmLogout}
              className="text-gray-600 flex items-center gap-2 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </nav>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white  dark:bg-slate-900 dark:text-slate-200 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-slate-600 dark:text-slate-200  rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;