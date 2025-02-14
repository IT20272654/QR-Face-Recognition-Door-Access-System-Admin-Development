import React from "react";
import AdminList from "../components/AdminList";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const AdminUsers = () => {
  

  return (
    <div className="flex h-full dark:bg-slate-700">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="p-6 space-y-4 ">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Admin Management
          </h2>
        
        <AdminList />

      </div>  
      </div>
          
    </div>
  );
};

export default AdminUsers;