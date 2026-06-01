import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import BusinessSettings from './components/BusinessSettings';
import { MessageSquare, LayoutDashboard, Settings } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-blue-600">Booking AI</h1>
          </div>
          <div className="flex-1 p-4 space-y-2">
            <Link to="/" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <MessageSquare size={20} />
              <span>Chat Widget</span>
            </Link>
            <Link to="/dashboard" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <LayoutDashboard size={20} />
              <span>Leads Dashboard</span>
            </Link>
            <Link to="/settings" className="flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
              <Settings size={20} />
              <span>Business Settings</span>
            </Link>
          </div>
          <div className="p-4 text-xs text-gray-400 text-center border-t">
            Powered by CTO.new
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<div className="p-8"><Chat /></div>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<BusinessSettings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
