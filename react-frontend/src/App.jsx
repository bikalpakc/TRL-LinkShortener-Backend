import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Sun, Moon } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-2xl z-[100] hover:scale-110 transition"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;