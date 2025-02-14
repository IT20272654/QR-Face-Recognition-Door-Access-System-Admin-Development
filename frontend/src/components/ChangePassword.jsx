import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


 


const ChangePassword = () => {
    

    //change password
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  
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
    <div className="m-2">
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
        <div className="flex justify-start">
          <button
            onClick={handleSavePassword}
            className="bg-blue-600  text-white px-10 py-1.5 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 my-4">
            Change Password
          </button>
          </div>
    </div>
  )
}

export default ChangePassword
