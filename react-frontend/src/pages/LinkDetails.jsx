import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Globe, Monitor, Smartphone, BarChart3 } from 'lucide-react';

export default function LinkDetails() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [clicks, setClicks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null); // New error state
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        // Note: Check your Django URL trailing slashes! 
        const [clicksRes, summaryRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/analytics/${shortCode}/`, { headers }),
          axios.get(`http://localhost:8000/api/analytics/${shortCode}/summary/`, { headers })
        ]);
        setClicks(clicksRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics. The link might not exist.");
      }
    };
    fetchData();
  }, [shortCode, token]);

  if (error) return (
    <div className="p-10 text-center text-red-500">
      <p>{error}</p>
      <button onClick={() => navigate('/dashboard')} className="mt-4 text-indigo-600 underline">Go Back</button>
    </div>
  );

  if (!summary) return <div className="p-10 text-center dark:text-white">Loading stats...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 mb-8 hover:text-indigo-600">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 mb-8">
          <h1 className="text-3xl font-bold mb-2">{summary.short_code}</h1>
          <p className="text-slate-500 truncate">{summary.original_url}</p>
          <div className="mt-6 flex gap-8">
            <div>
              <span className="text-4xl font-black text-indigo-600">{summary.total_clicks}</span>
              <p className="text-xs uppercase text-slate-400 font-bold">Total Clicks</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Click Log</h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs uppercase">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Browser</th>
                <th className="p-4">Device Information</th>
                <th className="p-4 text-slate-900 dark:text-white">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clicks.map(click => (
                <tr key={click.id} className="text-sm dark:text-slate-300">
                  <td className="p-4">{new Date(click.clicked_at).toLocaleString()}</td>
                  <td className="p-4 font-mono">{click.ip_address}</td>
                  <td className="p-4">{click.browser.split(' ')[0]}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {/* Use (click.device_type || "") to ensure it's at least an empty string before checking .includes() */}
                      {(click.device_type || "").includes('PC') ? (
                        <Monitor size={14} className="text-slate-400" />
                      ) : (
                        <Smartphone size={14} className="text-slate-400" />
                      )}

                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {click.device_type || "Unknown Device"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {click.city}, {click.country}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                        IP: {click.ip_address}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clicks.length === 0 && <p className="p-10 text-center text-slate-500">No clicks recorded yet.</p>}
        </div>
      </div>
    </div>
  );
}