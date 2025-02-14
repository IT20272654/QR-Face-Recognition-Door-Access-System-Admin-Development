import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";



const Profile = () => {

  //edit name
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [error, setError] = useState("");
  const userRole = localStorage.getItem('role'); // Assuming you store the role in localStorage

  //change password
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  //change names and email
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('/api/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { firstName, lastName, email } = response.data;
        setProfile({ firstName, lastName, email });
      } catch (err) {
        setError("Failed to fetch profile information");
      }
    };

    fetchProfile();
  }, []);

  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveName = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        '/api/admin/me',
        {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setError("");
      alert("Profile updated successfully");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Super Admins are not allowed to update their profile");
      } else {
        setError("Failed to update profile");
      }
    }
  };

  
 //change password
  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          '/api/admin/change-password',
          {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessMessage('Password changed successfully');
      } catch (err) {
        setPasswordError('Failed to change password');
      }
    }
  };

  return (
    <div className="flex h-full dark:bg-slate-700">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6 space-y-4 ">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Profile
          </h2>

        

        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-100 dark:bg-slate-600 rounded-lg shadow">

          
            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Name and Email change </h2>
  
            {error && <p className="text-red-500">{error}</p>}
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/*First name */}
              <div>
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChangeName}
                  className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  disabled={userRole === 'SuperAdmin'}
                />

                </div>
                <div>

                {/* Last name */}
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChangeName}
                  className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  disabled={userRole === 'SuperAdmin'}
                />
              </div> 
            </div>

            {/* email */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChangeName}
                  className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  disabled={userRole === 'SuperAdmin'}
                />
              </div>
  
            {/* Save Button */}
            {userRole !== 'SuperAdmin' && (
              <div className="mt-8">
                <button
                  onClick={handleSaveName}
                  className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Save
                </button>
              </div>
            )}
                  
        </div>

        

        <div className="p-4 bg-slate-100 dark:bg-slate-600 rounded-lg shadow">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
              Change Password
            </h3>
          <div className="mt-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handleChangePassword}
              className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
              placeholder="********"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChangePassword}
              className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
              placeholder="********"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChangePassword}
              className="mt-1 w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
              placeholder="********"
            />
          </div>
          
          {passwordError && <p className="text-red-600 mt-2">{passwordError}</p>}
          {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}

          {/* Save Button */}
          <button
            onClick={handleSavePassword}
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 my-4">
            Save
          </button>
        </div>

        </div>
      </div>
      </div>
      </div>
      
        
  );
};

export default Profile;