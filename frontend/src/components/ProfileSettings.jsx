import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const userRole = localStorage.getItem('role'); // Assuming you store the role in localStorage
  const navigate = useNavigate();

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
      setSuccessMessage("Profile updated successfully"); // Set success message
    } catch (err) {
      setSuccessMessage(""); // Clear success message on error
      if (err.response && err.response.status === 403) {
        setError("Super Admins are not allowed to update their profile");
      } else {
        setError("Failed to update profile");
      }
    }
  };

  return (
    <div className="m-2">
      <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Name and Email change</h2>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* First Name */}
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

        {/* Last Name */}
        <div>
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

      {/* Email */}
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

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}

      {/* Save Button */}
      {userRole !== 'SuperAdmin' && (
        <div >
          <button
            onClick={handleSaveName}
            className="bg-blue-600  text-white px-10 py-1.5 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 my-4"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
