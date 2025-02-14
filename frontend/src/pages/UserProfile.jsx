import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiError } from "react-icons/bi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatar from "../assets/avatar.png";
import ConfirmationModal from "../components/ConfirmationModal";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import UPDoorAccess from "../components/UPDoorAccess";
import UPHistory from "../components/UPHistory";
import UPPermissionRequests from "../components/UPPermissionRequests";
import UPRejectedPermissionRequests from "../components/UPRejectedPermissionRequests";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  console.log("User:", user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoorLocation, setSelectedDoorLocation] = useState('');
  const [doors, setDoors] = useState([]);
  console.log("Doors:", doors);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionFormData, setPermissionFormData] = useState({
    userId: user?.userId || '',
    door: '',
    date: '',
    inTime: '',
    outTime: '',
    message: ''
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
  });
  const [emailUnique, setEmailUnique] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    date: '',
    inTime: '',
    outTime: ''
  });
  // Get current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  //user permition validation
  const validateTimes = () => {
    const errors = {};
    const selectedDate = permissionFormData.date;
    const selectedInTime = permissionFormData.inTime;
    const selectedOutTime = permissionFormData.outTime;
  
    // Date validation
    if (selectedDate < currentDate) {
      errors.date = "Cannot select a date in the past";
    }
  
    // Time validation only if date is today
    if (selectedDate === currentDate) {
      if (selectedInTime < currentTime) {
        errors.inTime = "In time cannot be in the past for today's date";
      }
    }
  
    // Out time should be after in time
    if (selectedInTime && selectedOutTime && selectedOutTime <= selectedInTime) {
      errors.outTime = "Out time must be after in time";
    }
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          userId: response.data.userId,
        });
        setPendingRequests(response.data.pendingRequests);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/history/recent-access`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const filteredHistory = response.data.filter(record => record.user._id === id);
        setHistoryRecords(filteredHistory);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    const fetchRejectedRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/permission-requests/rejected-requests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setRejectedRequests(response.data);
      } catch (err) {
        console.error("Error fetching rejected requests:", err);
      }
    };
    
    const fetchDoors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('/api/doors', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setDoors(response.data);
        console.log("Doors:", response.data);
      } catch (err) {
        console.error("Error fetching doors:", err);
      }
    };
  
    if (isPermissionModalOpen) {
      fetchDoors();
    }

    fetchUser();
    fetchHistory();
    fetchRejectedRequests();
  }, [id,isPermissionModalOpen]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.email.includes('@')) {
      setEmailError('Invalid email address');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUser(formData);
      setIsEditModalOpen(false);
      toast.success("User information updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  // Add form submission handler
  const handlePermissionSubmit = async () => {
    if (!validateTimes()) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post('/api/permission-requests/make', {
        user: user._id,
        door: permissionFormData.door,
        date: permissionFormData.date,
        inTime: permissionFormData.inTime,
        outTime: permissionFormData.outTime,
        message: permissionFormData.message,
        status: 'Approved'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      
      toast.success("Permission request submitted successfully!");
      setIsPermissionModalOpen(false);
    } catch (err) {
      console.error("Error submitting permission request:", err);
      toast.error("Failed to submit permission request");
    }
  };
  //handlePermission function
  const handlePermission = () => {
    setIsPermissionModalOpen(true);
    setPermissionFormData({
      ...permissionFormData,
      userId: user.userId
    });
  };

  // Add form change handler
  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    setPermissionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      navigate("/users");
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email") {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/users/check-email-update?email=${value}&userId=${formData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setEmailUnique(response.data.isUnique);
        setEmailError(response.data.isUnique ? "" : "Email already taken");
      } catch (error) {
        console.error("Error checking email uniqueness", error);
      }
    }
  };

  const handleRequestUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUser(response.data);
      setPendingRequests(response.data.pendingRequests);
    } catch (err) {
      console.error("Error fetching updated user data:", err);
    }
  };

  const handleAccessUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching updated user data:", err);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex dark:bg-slate-700">
      <Sidebar />
      <div className="flex-1">
        <Header />

        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            User Profile
          </h2>

          <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            <div className="flex items-center justify-between">
              {/* User Profile and Details */}
              <div className="flex items-center">
                <img
                  src={user.profilePicture || avatar}
                  alt="User Avatar"
                  className="w-32 h-32 object-cover rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-3">
                    {" "}
                    {user.firstName} {user.lastName}{" "}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">
                    <strong>User ID:</strong> {user.userId}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Edit User
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete User
                </button>
                <button onClick={handlePermission} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                  Permission
                </button>
              </div>
            </div>
          </div>

          {/* Pending Door Permission Requests */}
          <UPPermissionRequests
            pendingRequests={pendingRequests}
            onRequestUpdate={handleRequestUpdate}
          />

          {/* Door Access Table */}
          <UPDoorAccess
            accessRecords={user.doorAccess || []}
            userId={user._id}
            onAccessUpdate={handleAccessUpdate}
          />
          
          {/* Rejected Door Permission Requests */}
          <UPRejectedPermissionRequests rejectedRequests={rejectedRequests} />

          {/* Door Access History */}
          <UPHistory historyRecords={historyRecords} />

          {/* Edit User Modal */}
          <Modal isVisible={isEditModalOpen} onClose={handleCloseEditModal}>
            <h2 className="text-xl text-slate-700 dark:text-slate-200 font-bold mb-4">
              Edit User
            </h2>
            <div className="mb-4">
              <label className="block text-slate-700 dark:text-slate-200">
                User ID
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                disabled // Disable input for User ID
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-700 dark:text-slate-200">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-slate-700 dark:text-slate-200">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              />
              {emailUnique !== null && (
                <span className="absolute right-3 top-10 transform -translate-y-1/2 text-lg">
                  {emailUnique ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                </span>
              )}
              {emailError && (
                <p className="text-red-500 mt-1 flex items-center">
                  <BiError className="mr-1" /> {emailError}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseEditModal}
                className="bg-gray-500 w-20 dark:bg-slate-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`w-20 px-4 py-2 rounded ${
                  !emailUnique
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
                disabled={!emailUnique} // Disable submit if email is not unique
              >
                Save
              </button>
            </div>
          </Modal>
          {/* giver permission model */}
          <Modal isVisible={isPermissionModalOpen} onClose={() => setIsPermissionModalOpen(false)}>
            <h2 className="text-xl text-slate-700 dark:text-slate-200 font-bold mb-4">
              Create Permission Request
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-200 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={permissionFormData.userId}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-slate-600 dark:text-slate-100"
                  disabled
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 mb-2">
                  Door Access
                </label>
                <select
                  name="door"
                  value={permissionFormData.door}
                  onChange={(e) => {
                    handlePermissionChange(e);
                    // Find the selected door's location
                    const selectedDoor = doors.find(door => door._id === e.target.value);
                    setSelectedDoorLocation(selectedDoor?.location || '');
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                  required
                >
                  <option value="">Select Door</option>
                  {doors.map(door => (
                    <option key={door._id} value={door._id}>
                      {door.doorCode} - {door.roomName}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDoorLocation && (
                <div className="mb-2">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Location:</strong> {selectedDoorLocation}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-slate-700 dark:text-slate-200 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  min={currentDate}
                  value={permissionFormData.date}
                  onChange={(e) => {
                    handlePermissionChange(e);
                    validateTimes();
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                  required
                />
                {validationErrors.date && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-slate-700 dark:text-slate-200 mb-2">
                    In Time
                  </label>
                  <input
                    type="time"
                    name="inTime"
                    min={permissionFormData.date === currentDate ? currentTime : undefined}
                    value={permissionFormData.inTime}
                    onChange={(e) => {
                      handlePermissionChange(e);
                      validateTimes();
                    }}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                    required
                  />
                  {validationErrors.inTime && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.inTime}</p>
                  )}
                </div>

                <div>
                <label className="block text-slate-700 dark:text-slate-200 mb-2">
                  Out Time
                </label>
                <input
                  type="time"
                  name="outTime"
                  min={permissionFormData.inTime || undefined}
                  value={permissionFormData.outTime}
                  onChange={(e) => {
                    handlePermissionChange(e);
                    validateTimes();
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                  required
                />
                {validationErrors.outTime && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.outTime}</p>
                )}
              </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-200 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={permissionFormData.message}
                  onChange={handlePermissionChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsPermissionModalOpen(false)}
                  className="bg-gray-500 dark:bg-slate-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePermissionSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </Modal>
          {/* Delete User Modal */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            message="Are you sure you want to delete this user? This action cannot be undone."
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProfile;