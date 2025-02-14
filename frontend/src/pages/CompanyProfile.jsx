import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiError } from "react-icons/bi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../components/ConfirmationModal";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });
  const [nameAddressUnique, setNameAddressUnique] = useState(true); // Default to true
  const [nameAddressError, setNameAddressError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/admin/companies/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setCompany(response.data);
        setFormData({
          name: response.data.name,
          address: response.data.address,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/companies/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
  
      // Refetch the updated company details
      const response = await axios.get(`/api/admin/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setCompany(response.data); // Update the state with the new data
  
      setIsEditModalOpen(false);
      toast.success("Company information updated successfully!");
    } catch (err) {
      console.error("Error updating company:", err);
      setError(err.message);
    }
  };
  

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      navigate("/companies");
      toast.success("Company deleted successfully!");
    } catch (err) {
      console.error("Error deleting company:", err);
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

    if (name === "name" || name === "address") {
      if (formData.name.trim() === "" || formData.address.trim() === "") {
        setNameAddressUnique(true);
        setNameAddressError("");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/admin/companies/check-name-address-update?name=${formData.name}&address=${formData.address}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setNameAddressUnique(response.data.isUnique);
        setNameAddressError(response.data.isUnique ? "" : "Name and address combination already taken");
      } catch (error) {
        console.error("Error checking name and address uniqueness", error);
      }
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
            Company Profile
          </h2>

          <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            <div className="flex items-center justify-between">
              {/* Company Profile and Details */}
              <div className="flex items-center">
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-3">
                    {company.name}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">
                    <strong>Address:</strong> {company.address}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Edit Company
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete Company
                </button>
              </div>
            </div>
          </div>

          {/* Locations Tiles */}
          <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Locations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {company.locations.map((location, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-slate-700 dark:text-slate-300">
                  <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-2">
                    {location}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Users List */}
          <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              Company Admins
            </h3>
            <table className="w-full mt-4 bg-white dark:bg-slate-700 shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="text-left bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-gray-300 dark:border-slate-400">
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {company.admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <td className="p-3 border-t border-gray-200 dark:border-slate-500">{admin.firstName} {admin.lastName}</td>
                    <td className="py-2 px-4 border-t dark:border-slate-500 text-slate-500 dark:text-slate-300">{admin.email}</td>
                    <td className="py-2 px-4 border-t dark:border-slate-500 text-center">
                      <button
                        onClick={() => navigate(`/admin-users/${admin._id}`)}
                        className="bg-blue-500 dark:bg-blue-800 dark:text-slate-300 text-sm text-white py-1 px-3 rounded hover:bg-blue-600 dark:hover:bg-blue-900"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Company Modal */}
          <Modal isVisible={isEditModalOpen} onClose={handleCloseEditModal}>
            <h2 className="text-xl text-slate-700 dark:text-slate-200 font-bold mb-4">
              Edit Company
            </h2>
            <div className="mb-4 relative">
              <label className="block text-slate-700 dark:text-slate-200">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                />
                {nameAddressUnique !== null && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
                    {nameAddressUnique ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </span>
                )}
              </div>
              {nameAddressError && (
                <p className="text-red-500 mt-1 flex items-center">
                  <BiError className="mr-1" /> {nameAddressError}
                </p>
              )}
            </div>
            <div className="mb-4 relative">
              <label className="block text-slate-700 dark:text-slate-200">
                Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-600 dark:text-slate-100 focus:ring-blue-400"
                />
                {nameAddressUnique !== null && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg">
                    {nameAddressUnique ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                  </span>
                )}
              </div>
              {nameAddressError && (
                <p className="text-red-500 mt-1 flex items-center">
                  <BiError className="mr-1" /> {nameAddressError}
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
                  !nameAddressUnique
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
                disabled={!nameAddressUnique} // Disable submit if name and address combination is not unique
              >
                Save
              </button>
            </div>
          </Modal>

          {/* Delete Company Modal */}
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            message="Are you sure you want to delete this company? This action cannot be undone."
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CompanyProfile;