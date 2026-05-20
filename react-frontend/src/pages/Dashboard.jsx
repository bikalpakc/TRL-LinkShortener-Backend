import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useWebSockets } from '../hooks/useWebSockets'; // Updated path
import { Link2, BarChart3, ExternalLink, Scissors, LogOut, Copy } from 'lucide-react';

const API_URL = "http://localhost:8000/api";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'click_update') {
      setLinks(prev => prev.map(link => 
        link.id == data.link_id ? { ...link, total_clicks: data.total_clicks } : link
      ));
    }
  }, []);

  useWebSockets(token, handleWebSocketMessage);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`${API_URL}/links/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLinks(res.data);
      } catch (err) { navigate('/login'); }
    };
    fetchLinks();
  }, [token, navigate]);

  const shortenUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/links/`, { original_url: url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLinks([res.data, ...links]);
      setUrl('');
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!"); // You can replace this with a nice toast notification later
};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg"><Scissors size={20} className="text-white" /></div>
            <span className="text-xl font-bold dark:text-white">trl<span className="text-indigo-500">.</span></span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition">
            <LogOut size={18} /> <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-sm mb-12">
          <form onSubmit={shortenUrl} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-link"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
            <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition">
              {loading ? "..." : "Shorten"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {links.map(link => (
  <div key={link.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
    <div className="flex-1">
      <div className="flex items-center gap-3">
<div className="flex items-center gap-3">
  {/* Wrap the short URL in an <a> tag */}
  <a 
    href={link.short_url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
  >
    {link.short_url}
  </a>
  <button onClick={() => copyToClipboard(link.short_url)} className="text-slate-400 hover:text-indigo-500 transition">
    <Copy size={16} />
  </button>
</div>
        <a href={link.short_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-500">
          <ExternalLink size={16} />
        </a>
      </div>
      <p className="text-slate-500 text-sm truncate max-w-xs md:max-w-md">{link.original_url}</p>
    </div>

    <div className="flex items-center gap-4">
        {/* NEW: Analytics Button */}
        <button 
          onClick={() => navigate(`/analytics/${link.short_code}`)}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 uppercase tracking-tight"
        >
          View Details
        </button>

        <div className="text-center bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{link.total_clicks}</span>
          <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold">Clicks</span>
        </div>
    </div>
  </div>
))}
        </div>
      </main>
    </div>
  );
}