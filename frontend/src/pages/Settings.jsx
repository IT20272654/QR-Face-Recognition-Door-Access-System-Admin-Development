import React, { useState } from 'react';
import { GoChevronRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import AboutUs from '../components/AboutUs';
import AdminContact from '../components/AdminContact';
import AppInformation from '../components/AppInformation';
import ChangePassword from '../components/ChangePassword';
import Header from '../components/Header';
import Languages from '../components/Languages';
import ProfileSettings from '../components/ProfileSettings';
import Sidebar from '../components/Sidebar';
import ThemeChange from '../components/ThemeChange';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile-settings'); // Default to ThemeChange
  const navigate = useNavigate();



  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'theme':
        return <ThemeChange />;
      case 'change-password':
        return <ChangePassword />;
      case 'language':
        return <Languages/>
      case 'profile-settings':
        return <ProfileSettings/>
      case 'app-info':
        return <AppInformation/>
      case 'admin-contact':
        return <AdminContact/>
      case 'about-us':
        return <AboutUs/>
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full dark:bg-slate-700">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Settings
          </h2>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left Column: Settings Panel */}
            <div >
              <div className="p-4 bg-slate-100 dark:bg-slate-600 rounded-lg shadow" >
                
                <nav className="flex min-w-[240px] flex-col gap-1 p-1.5 dark:text-slate-100 mt-3">
                  {[
                    { id: 'profile-settings', label: 'Profile Settings' },
                    { id: 'change-password', label: 'Change Password' },
                    { id: 'theme', label: 'Theme' },
                    { id: 'language', label: 'Language' },
                    { id: 'app-info', label: 'App Information' },
                    { id: 'admin-contact', label: 'Emagency Contact' },
                    { id: 'about-us', label: 'About Us' },
                    
                  ].map((item) => (
                    <div
                      key={item.id}
                      role="button"
                      onClick={() => setActiveSection(item.id)}
                      className={` text-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-300 focus:bg-slate-300 active:bg-slate-300 justify-between ${
                        activeSection === item.id ? 'bg-blue-200 dark:bg-slate-800' : ''
                      }`}
                    >
                      {item.label}
                      <GoChevronRight className="text-gray-500" />
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Column: Active Section */}
            <div>
              <div className="p-4 bg-slate-100 dark:bg-slate-600 rounded-lg shadow">
                {renderActiveComponent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
