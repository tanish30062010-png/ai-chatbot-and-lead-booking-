import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, CheckCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';

const BusinessSettings = () => {
  const [info, setInfo] = useState({
    business_name: '',
    services: '',
    pricing: '',
    faqs: '',
    hours: '',
    contact: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE}/business-info`);
      setInfo(res.data);
    } catch (err) {
      console.error('Error fetching business info', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/business-info`, info);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Error saving business info', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Business Configuration</h1>
      
      <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input
            type="text"
            name="business_name"
            value={info.business_name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
          <textarea
            name="services"
            value={info.services}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pricing</label>
          <textarea
            name="pricing"
            value={info.pricing}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">FAQs</label>
          <textarea
            name="faqs"
            value={info.faqs}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
          <input
            type="text"
            name="hours"
            value={info.hours}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
          <input
            type="text"
            name="contact"
            value={info.contact}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
        >
          {isSaved ? <CheckCircle size={20} /> : <Save size={20} />}
          {isSaved ? 'Saved!' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
};

export default BusinessSettings;
