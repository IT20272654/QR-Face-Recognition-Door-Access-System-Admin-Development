import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BiError } from "react-icons/bi";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Set maximum users per page
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    userId: '',
    email: '',
    password: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [emailUnique, setEmailUnique] = useState(null);
  const [userIdUnique, setUserIdUnique] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [userIdError, setUserIdError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          throw new Error('API response is not an array');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.userId.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    const token = localStorage.getItem('token');

    if (name === 'email') {
      try {
        const response = await axios.get(`/api/users/check-email?email=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setEmailUnique(response.data.isUnique);
        setEmailError(response.data.isUnique ? '' : 'Email already taken');
      } catch (error) {
        console.error('Error checking email uniqueness', error);
        toast.error('Error checking email uniqueness');
      }
    }

    if (name === 'userId') {
      try {
        const response = await axios.get(`/api/users/check-userId?userId=${value}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUserIdUnique(response.data.isUnique);
        setUserIdError(response.data.isUnique ? '' : 'User ID already in use');
      } catch (error) {
        console.error('Error checking user ID uniqueness', error);
        toast.error('Error checking user ID uniqueness');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/users/register', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setIsModalVisible(false);
      setNewUser({
        firstName: '',
        lastName: '',
        userId: '',
        email: '',
        password: ''
      });
      // Refresh the user list
      const response = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      toast.success('User created successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error creating user');
    }
  };

  const handleRowClick = (id) => {
    navigate(`/users/${id}`);
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  // Calculate pagination indices
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
      <ToastContainer />
      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold dark:text-slate-100 mb-4">User List</h2>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name, email, or user ID"
          value={searchQuery}
          onChange={handleSearch}
          className="border dark:border-none px-4 py-2 rounded w-80 dark:bg-slate-700 dark:text-slate-100"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalVisible(true)}
        >
           Add User
        </button>
      </div>
      </div>
      <table className="w-full mt-4 bg-white dark:bg-slate-700 shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <th className="p-4 border-b border-gray-300 dark:border-slate-400">Full Name</th>
            <th className="p-4 border-b border-gray-300 dark:border-slate-400">Email</th>
            <th className="p-4 border-b border-gray-300 dark:border-slate-400">User ID</th>
            <th className="p-4 border-b border-gray-300 dark:border-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr
              key={user._id}
              className={`hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 ${
                index === currentUsers.length - 1 ? "rounded-b-md" : ""
              }`}
            >
              <td className="p-3 border-t border-gray-200 dark:border-slate-500">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-3 border-t border-gray-200 dark:border-slate-500">{user.email}</td>
              <td className="p-3 border-t border-gray-200 dark:border-slate-500">{user.userId}</td>
              <td className="p-3 border-t border-gray-200 dark:border-slate-500">
                <button
                  className="text-blue-400"
                  onClick={() => handleRowClick(user._id)}
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? 'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed' : 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === index + 1 ? 'bg-blue-700 dark:bg-slate-800 text-white' : 'bg-gray-200 dark:bg-slate-500 dark:text-gray-100 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ?  'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed' : 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
      <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <h2 className="text-xl text-slate-700 dark:text-slate-200 font-bold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-700 dark:text-slate-200">First Name</label>
            <input
              type="text"
              name="firstName"
              value={newUser.firstName}
              placeholder='John'
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-slate-200">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={newUser.lastName}
              placeholder='Smith'
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              placeholder='johnsmith@gmail.com'
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              required
            />
            {emailUnique !== null && (
              <span className="absolute right-3 top-10 transform -translate-y-1/2 text-lg">
                {emailUnique ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
              </span>
            )}
            {emailError && (
              <p className="text-red-500 mt-1 flex items-center">
                <BiError className="mr-1" /> {emailError}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 dark:text-slate-200">User ID</label>
            <input
              type="text"
              name="userId"
              value={newUser.userId}
              placeholder='InSP/yyyy/xxx/xxx'
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              required
            />
            {userIdUnique !== null && (
              <span className="absolute right-3 top-10 transform -translate-y-1/2 text-lg">
                {userIdUnique ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
              </span>
            )}
            {userIdError && (
              <p className="text-red-500 mt-1 flex items-center">
                <BiError className="mr-1" /> {userIdError}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              placeholder='******'
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 w-20 dark:bg-slate-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setIsModalVisible(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-20 px-4 py-2 rounded ${!emailUnique || !userIdUnique ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
              disabled={!emailUnique || !userIdUnique} // Disable submit if email or userId is not unique
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;