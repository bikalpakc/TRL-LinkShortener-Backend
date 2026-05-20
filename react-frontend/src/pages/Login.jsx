import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Lock, Mail } from 'lucide-react';

const API_URL = "http://localhost:8000/api/users/login/";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, { email, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-xl mb-4">
            <Scissors className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Login to manage your short links</p>
        </div>

        {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/30">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}