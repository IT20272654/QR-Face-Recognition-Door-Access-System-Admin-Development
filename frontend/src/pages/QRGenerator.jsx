import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const QRGenerator = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [doorCode, setDoorCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [qrData, setQrData] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isQrGenerated, setIsQrGenerated] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Company details fetched:', response.data.company); // Log the company details
        if (response.data.company) {
          setCompanyName(response.data.company.name);
          setCompanyId(response.data.company._id); // Set the company ID
          setLocations(response.data.company.locations || []); // Set the locations
        } else {
          console.error('Company details not found in response');
        }
      } catch (error) {
        console.error('Failed to fetch company details', error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleDoorCodeChange = (e) => {
    setDoorCode(e.target.value);
  };

  const generateQRCode = async (e) => {
    e.preventDefault();
    console.log('Generating QR Code with:', { companyId, doorCode, roomName, selectedLocation });
    if (companyId && doorCode && roomName && selectedLocation) {
      const qrValue = `${doorCode}`;
      setQrData(qrValue);
      setIsQrGenerated(true);
      console.log('QR Code generated:', qrValue);
    } else {
      toast.error('Please fill in all fields.');
    }
  };

  const saveQRCodeToDatabase = async () => {
    try {
      // Capture the QR Code canvas as a Base64 string
      const canvas = document.getElementById('qrCode');
      const qrBase64 = canvas.toDataURL('image/png');
  
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/doors/create/', {
        location: selectedLocation, // Use selected location
        doorCode,
        roomName,
        qrData,
        qrImage: qrBase64, // Include the Base64 image
        company: companyId, // Attach company ID
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data.message);
      navigate('/doors'); // Navigate to the doors page after successful save
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === "Door code already exists.") {
        toast.error('Door code already exists. Please choose a different one.');
      } else {
        console.error(error);
        toast.error('Failed to save QR Code.');
      }
    }
  };

  const addNewLocation = async () => {
    if (!newLocation) {
      toast.error('Please enter a location name.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/add-location', {
        companyId,
        location: newLocation,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocations([...locations, newLocation]);
      setSelectedLocation(newLocation);
      setNewLocation('');
      toast.success('Location added successfully');
    } catch (error) {
      console.error('Failed to add location', error);
      toast.error('Failed to add location.');
    }
  };

  const handleDeleteLocation = async (locationToDelete) => {
    try {
      const token = localStorage.getItem('token');
      
      // First make the API call to delete the location
      await axios.delete('/api/admin/delete-location', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          companyId, // Using the companyId from state
          location: locationToDelete
        }
      });
  
      // Only update local state if API call succeeds
      const updatedLocations = locations.filter(location => location !== locationToDelete);
      setLocations(updatedLocations);
      
      // Clear selection if deleted location was selected
      if (selectedLocation === locationToDelete) {
        setSelectedLocation('');
      }
  
      toast.success('Location deleted successfully');
      
    } catch (error) {
      console.error('Failed to delete location', error);
      toast.error('Failed to delete location.');
      // Optionally: revert local state if you want optimistic updates
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrCode');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${doorCode}_${roomName}_${companyName}_QR.png`;
    downloadLink.click();
  };

  return (
    <div className="flex dark:bg-slate-700">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create a new Door</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Form */}
          <div className="p-6 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            <h2 className="text-xl font-semibold dark:text-slate-100 mb-4">Enter Details</h2>
            <form onSubmit={generateQRCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-slate-200">Door ID</label>
                <input
                  type="text"
                  value={doorCode}
                  onChange={handleDoorCodeChange}
                  placeholder="Enter door ID"
                  className="w-full px-4 py-2 border dark:border-none rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-700 dark:text-slate-300 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-slate-200">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-2 border dark:border-none rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-700 dark:text-slate-300 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-slate-200">Location</label>
                <div className="relative">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-2 border dark:border-none rounded-lg focus:outline-none focus:ring-2 dark:bg-slate-700 dark:text-slate-300 focus:ring-blue-400 cursor-pointer flex justify-between items-center"
                  >
                    {selectedLocation || "Select a location"}
                    <svg
                      className={`w-5 h-5 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border dark:border-none rounded-lg shadow-lg max-h-60 overflow-auto">
                      {locations.map((location, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-600 cursor-pointer"
                          onClick={() => {
                            setSelectedLocation(location);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span>{location}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLocation(location);
                            }}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 dark:hover:bg-slate-500"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Add new location"
                    className="w-full px-4 py-2 border dark:border-none rounded-lg focus:outline-none focus:ring-2  dark:bg-slate-700 dark:text-slate-300 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    onClick={addNewLocation}
                    className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={!companyId || !doorCode || !roomName || !selectedLocation}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Generate QR Code
                </button>
              </div>
            </form>
          </div>

          {/* Middle Column: QR Code Display */}
          <div className="flex items-center justify-center p-6  border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            {qrData ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold dark:text-slate-100  mb-6">Generated QR Code</h2>
                <QRCodeCanvas
                  id="qrCode"
                  value={qrData}
                  size={200}
                  bgColor={'#ffffff'}
                  level={'H'}
                  className='p-4 bg-white'
                />
                <div>
                  <button
                    type="button"
                    onClick={downloadQRCode}
                    disabled={!qrData}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 my-5"
                  >
                    Download QR Code
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-slate-200">No QR Code generated yet.</p>
            )}
          </div>

          {/* Right Column: QR Code Details */}
          <div className="p-6 border dark:border-none rounded-lg shadow-sm bg-white dark:bg-slate-600">
            
            {qrData ? (
              <div className="">
                <h2 className="text-xl font-semibold dark:text-slate-100  mb-4">QR Code Details</h2>
                <div className="divide-y divide-gray-300">
                  <div className="flex items-center py-2">
                    <span className="font-medium dark:text-slate-300 w-1/2">Company Name</span>
                    <span className="border-l border-gray-300 dark:text-slate-200 pl-2">{companyName}</span>
                  </div>
                  <div className="flex items-center py-2">
                    <span className="font-medium dark:text-slate-300 w-1/2">Door Code</span>
                    <span className="border-l border-gray-300 dark:text-slate-200 pl-2">{doorCode}</span>
                  </div>
                  <div className="flex items-center py-2">
                    <span className="font-medium dark:text-slate-300 w-1/2">Room Name</span>
                    <span className="border-l border-gray-300 dark:text-slate-200 pl-2">{roomName}</span>
                  </div>
                  <div className="flex items-center py-2">
                    <span className="font-medium dark:text-slate-300 w-1/2">Location</span>
                    <span className="border-l border-gray-300 dark:text-slate-200 pl-2">{selectedLocation}</span>
                  </div>
                  <div className="flex items-center py-2">
                    <span className="font-medium dark:text-slate-300 w-1/2">QR Data</span>
                    <span className="border-l border-gray-300 dark:text-slate-200 pl-2">{qrData}</span>
                  </div>
                </div>

                <div className="flex mt-12">
                  <button
                    onClick={saveQRCodeToDatabase}
                    disabled={!isQrGenerated}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add new Door
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center my-32 dark:text-slate-200">No details available.</p>
            )}
          </div>
        </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default QRGenerator;