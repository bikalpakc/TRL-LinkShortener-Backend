import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link2, BarChart3, ExternalLink, Scissors, Globe } from 'lucide-react';
import { useWebSockets } from './hooks/useWebSockets';

const API_URL = "http://localhost:8000/api";

function App() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // We use the token you manually pasted into LocalStorage earlier
  const token = localStorage.getItem('access_token');

  // This function runs whenever a WebSocket message arrives
  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'click_update') {
      // Functional update: Find the link by ID and update its click count
      setLinks(prevLinks => prevLinks.map(link => 
        link.id === data.link_id ? { ...link, total_clicks: data.total_clicks } : link
      ));
    }
  }, []);

  // Use our custom real-time hook
  useWebSockets(token, handleWebSocketMessage);

  // Fetch all links on page load
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`${API_URL}/links/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLinks(res.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    if (token) fetchLinks();
  }, [token]);

  const shortenUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/links/`, 
        { original_url: url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLinks([res.data, ...links]); // Add new link to the top
      setUrl('');
    } catch (err) {
        alert("Make sure your Django server is running and CORS is enabled!");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-10 text-center">
        <div>
            <h1 className="text-4xl font-bold mb-4">Auth Required</h1>
            <p className="text-slate-400">Please paste your JWT access_token into LocalStorage to continue.</p>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Scissors size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">trl<span className="text-indigo-500">.</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Shorten Box */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl mb-12">
          <h2 className="text-lg font-medium mb-4 text-white">Shorten a long URL</h2>
          <form onSubmit={shortenUrl} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="url" required value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-link"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <button 
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Shrinking..." : "Shorten Now"}
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-slate-400 font-medium">Your Recent Links</h3>
            <span className="text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {links.length} total
            </span>
          </div>

          {links.map(link => (
            <div key={link.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition group animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-1 overflow-hidden w-full">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white tracking-tight">{link.short_url}</span>
                  <a href={link.short_url} target="_blank" className="text-slate-500 hover:text-indigo-400 transition">
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-slate-500 text-sm truncate">{link.original_url}</p>
              </div>
              
              <div className="flex items-center gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800 min-w-[120px] justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-indigo-400 tabular-nums">
                    {link.total_clicks}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    <BarChart3 size={10} /> Clicks
                  </div>
                </div>
              </div>
            </div>
          ))}

          {links.length === 0 && (
            <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <Globe className="mx-auto text-slate-700 mb-4" size={40} />
                <p className="text-slate-500">No links shortened yet. Start by pasting a URL above!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;