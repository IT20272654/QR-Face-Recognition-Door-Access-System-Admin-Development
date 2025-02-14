import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const [companyName, setCompanyName] = useState(null);
  const [userDetails, setUserDetails] = useState({ firstName: "", lastName: "" }); // State for user's name

  const isDarkTheme = theme === 'dark';
  const handleThemeToggle = () => {
    toggleTheme();
  };

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    if (userRole === 'Admin') {
      const companyName = localStorage.getItem('companyName');
      setCompanyName(companyName);
    }
  }, [userRole]);

// User details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserDetails({ firstName: data.firstName, lastName: data.lastName });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

// Message count
  useEffect(() => {
    if (userRole === 'Admin') {
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
    }
  }, [userRole]);


  const getTitle = (path) => {
    if (path.startsWith('/users/') && path.split('/').length === 3) {
      return 'User Profile';
    }
    if (path.startsWith('/doors/') && path.split('/').length === 3) {
      return 'Door Details';
    }
    if (path.startsWith('/companies/') && path.split('/').length === 3) {
      return 'Company Profile';
    }
    if (path.startsWith('/admin-users/') && path.split('/').length === 3) {
      return 'Admin Profile';
    }
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/users':
        return 'Users';
      case '/doors':
        return 'Doors';
      case '/create-door':
        return 'Create Door';
      case '/settings':
        return 'Settings';
      case '/profile':
        return 'Profile';
      case '/admin-users':
        return 'Admins';
      case '/companies':
        return 'Companies';
      default:
        return '';
    }
  };

 
  return (
    <div>
      <header className="flex justify-between items-center p-5 bg-white dark:bg-slate-700">
        <div>
          {userRole === 'Admin' && companyName && (
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{companyName}</h1>
          )}
          <h2 className="text-gray-600 text-sm dark:text-slate-300">Pages / {getTitle(location.pathname)}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center mr-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkTheme}
                onChange={handleThemeToggle}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:bg-gray-700"></div>
            </label>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              Switch {isDarkTheme ? 'Light' : 'Dark'} Mode
            </span>
          </div>

          {userRole === 'Admin' && (
            <div className="relative mr-2">
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">{unreadCount}</span>
              <button className="text-yellow-400 text-3xl mt-1"><FaBell /></button>
            </div>
          )}
          
           <div>
            <div className="text-xs font-light dark:text-slate-300">logged in as</div>
            <div className="text-lg font-medium text-gray-800 dark:text-white">
              {userDetails.firstName} {userDetails.lastName}
            </div>
          </div>
        </div>
      </header>
      <hr />
    </div>
  );
};

export default Header;