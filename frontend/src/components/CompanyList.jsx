import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaList, FaTh } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // State for view mode
  const [currentPage, setCurrentPage] = useState(0); // State for current page
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const navigate = useNavigate();

  const companiesPerPage = 12;
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("/api/admin/companies-with-admins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCompanies(response.data);
        setFilteredCompanies(response.data); // Set initial filtered companies to all companies
      } catch (err) {
        console.error('Failed to fetch companies', err);
        toast.error('Failed to fetch companies. Please try again.');
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Filter companies based on the search query
    if (searchQuery) {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies); // If no search query, show all companies
    }
  }, [searchQuery, companies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const checkResponse = await axios.get(
        "/api/admin/companies/check-name-address-update",
        {
          params: { name: newCompany.name, address: newCompany.address },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!checkResponse.data.isUnique) {
        toast.error('Company name and address combination already taken');
        return;
      }

      const response = await axios.post("/api/admin/create-company", newCompany, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies([...companies, response.data]);
      setNewCompany({ name: '', address: '' });
      setShowModal(false);
      setError('');
      toast.success('Company created successfully');
    } catch (err) {
      setError('Failed to create company');
      toast.error('Failed to create company');
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleTileClick = (id) => {
    navigate(`/companies/${id}`);
  };

  const currentCompanies = filteredCompanies.slice(
    currentPage * companiesPerPage,
    (currentPage + 1) * companiesPerPage
  );

  return (
    <div className="p-4 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600" aria-hidden={showModal}>
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <FaTh
            aria-label="Grid View"
            onClick={() => setViewMode('grid')}
            className={`cursor-pointer text-2xl ${viewMode === 'grid' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'} hover:text-blue-600`}
          />
          <FaList
            aria-label="List View"
            onClick={() => setViewMode('list')}
            className={`ml-2 cursor-pointer text-2xl ${viewMode === 'list' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'} hover:text-blue-600`}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or address"
            className="border dark:border-none px-4 py-2 rounded w-80 dark:bg-slate-700 dark:text-slate-100"
          />
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Company
          </button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCompanies.map((company) => (
            <div
              key={company._id}
              className="p-6 rounded-lg shadow-md bg-slate-100 dark:bg-slate-700 cursor-pointer hover:dark:bg-slate-800 hover:bg-slate-300"
              onClick={() => handleTileClick(company._id)}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">{company.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{company.address}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <table className="w-full mt-4 bg-white dark:bg-slate-700 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="text-left bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-gray-300 dark:border-slate-400">
                <th className="p-4">Name</th>
                <th className="p-4">Address</th>
                <th className="p-4">Admins</th>
              </tr>
            </thead>
            <tbody>
              {currentCompanies.map((company) => (
                <tr
                  key={company._id}
                  className="hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  onClick={() => handleTileClick(company._id)}
                >
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">
                    <p className="text-sm font-medium">{company.name}</p>
                  </td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">
                    <p className="text-sm font-medium">{company.address}</p>
                  </td>
                  <td className="p-3 border-t border-gray-200 dark:border-slate-500">
                    <ul className="list-disc list-inside">
                      {company.admins.map((admin) => (
                        <li key={admin._id} className="text-sm text-gray-900 dark:text-slate-200">
                          {admin.firstName} {admin.lastName}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${
            currentPage === 0
              ? 'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed'
              : 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
          }`}
        >
          Previous
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index)}
              className={`px-3 py-1 rounded ${
                currentPage === index
                  ? 'bg-blue-700 dark:bg-slate-800 text-white'
                  : 'bg-gray-200 dark:bg-slate-500 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages - 1
              ? 'bg-gray-200 text-gray-400 dark:bg-slate-500 cursor-not-allowed'
              : 'bg-blue-600 dark:bg-slate-800 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-700 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold dark:text-slate-100 text-gray-800 mb-4">Create Company</h2>
            <form onSubmit={handleCreateCompany}>
              <div className="mb-4">
                <label className="block mb-2 dark:text-slate-200 text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCompany.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border dark:bg-slate-600 dark:border-slate-500 rounded dark:text-slate-100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 dark:text-slate-200 text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newCompany.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border dark:bg-slate-600 dark:border-slate-500 rounded dark:text-slate-100"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-slate-500 text-gray-700 dark:text-slate-200 rounded hover:bg-gray-400 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-slate-800 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
