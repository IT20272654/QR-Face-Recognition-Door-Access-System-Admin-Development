import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeProvider } from "../context/ThemeContext"; // Import the ThemeProvider

import ProtectedRoute from './components/ProtectedRoute';
import AdminProfile from './pages/AdminProfile';
import AdminUsers from './pages/AdminUsers';
import Companies from './pages/Companies';
import CompanyProfile from './pages/CompanyProfile';
import Dashboard from './pages/Dashboard';
import DoorDetails from './pages/DoorDetails';
import Doors from './pages/Doors';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import QRGenerator from './pages/QRGenerator';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Users from './pages/Users';
import { clearAuthData, getToken, isTokenExpired } from './utils/auth';

const App = () => {
  const token = getToken();
  const isAuthenticated = token && !isTokenExpired(token);

  if (!isAuthenticated) {
    clearAuthData();
  }

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAuthenticated ? <ProtectedRoute allowedRoles={['Admin']}><Users /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="/users/:id" element={isAuthenticated ? <ProtectedRoute allowedRoles={['Admin']}><UserProfile /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="/doors" element={isAuthenticated ? <ProtectedRoute allowedRoles={['Admin']}><Doors /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="/doors/:id" element={isAuthenticated ? <ProtectedRoute allowedRoles={['Admin']}><DoorDetails /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="/create-door" element={isAuthenticated ? <ProtectedRoute allowedRoles={['Admin']}><QRGenerator /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/companies" element={isAuthenticated ? <ProtectedRoute allowedRoles={['SuperAdmin']}><Companies /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="//companies/:id" element={isAuthenticated ? <ProtectedRoute allowedRoles={['SuperAdmin']}><CompanyProfile /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="/admin-users" element={isAuthenticated ? <ProtectedRoute allowedRoles={['SuperAdmin']}><AdminUsers /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="/admin-users/:id" element={isAuthenticated ? <ProtectedRoute allowedRoles={['SuperAdmin']}><AdminProfile /></ProtectedRoute> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;