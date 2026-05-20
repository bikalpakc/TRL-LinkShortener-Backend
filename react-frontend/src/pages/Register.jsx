import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/users/register/", formData);
      localStorage.setItem('access_token', res.data.access);
      navigate('/dashboard');
    } catch (err) {
      setError("Registration failed. Email might already be taken.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-xl mb-4"><Scissors className="text-white" size={28} /></div>
          <h1 className="text-3xl font-bold dark:text-white text-slate-900">Create Account</h1>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" required placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" required placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="password" required placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">Register</button>
        </form>
        <p className="mt-6 text-center text-slate-500 text-sm">Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
}