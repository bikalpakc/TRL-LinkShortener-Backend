import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Sun, Moon } from 'lucide-react';
import LinkDetails from './pages/LinkDetails';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // 1. Check if user already manually picked a theme in the past
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme === 'dark';
    }
    
    // 2. If no saved preference, use the System Theme (Default)
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark'; // Tells browser scrollbars etc. to be dark
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  return (
    // Ensure the background color classes are on this div
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-slate-950">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-2xl z-[100] hover:scale-110 active:scale-95 transition-all"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/analytics/:shortCode" element={<PrivateRoute><LinkDetails /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;