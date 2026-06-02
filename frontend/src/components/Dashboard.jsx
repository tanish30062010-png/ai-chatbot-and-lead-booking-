import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, RefreshCcw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/leads?status=${filter}`);
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/leads/${id}`, { status: newStatus });
      fetchLeads();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const statuses = ['New', 'Booking Requested', 'Contacted', 'Confirmed', 'Closed'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Leads Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-md px-2 py-1 outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button 
            onClick={fetchLeads}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Date/Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No leads found.</td>
              </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{lead.email}</div>
                  <div className="text-sm text-gray-500">{lead.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.preferred_date} at {lead.preferred_time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={lead.status} 
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-2 py-1 outline-none border ${
                      lead.status === 'Confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      lead.status === 'Closed' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
