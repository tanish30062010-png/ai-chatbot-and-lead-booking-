import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, MessageSquare } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [businessInfo, setBusinessInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchBusinessInfo = async () => {
    try {
      const res = await axios.get(`${API_BASE}/business-info`);
      setBusinessInfo(res.data);
      // Initial welcome message
      setMessages([{
        role: 'assistant',
        content: `Hi! Welcome to ${res.data.business_name}. How can I help you today?`
      }]);
    } catch (err) {
      console.error('Error fetching business info', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        messages: [...messages, userMessage],
        businessInfo
      });

      let reply = res.data.reply;
      
      // Check for booking data in the reply
      const bookingMatch = reply.match(/BOOKING_DATA: ({.*})/);
      if (bookingMatch) {
        const bookingData = JSON.parse(bookingMatch[1]);
        // Save the lead
        await axios.post(`${API_BASE}/leads`, {
          name: bookingData.name,
          phone: bookingData.phone,
          email: bookingData.email,
          preferred_date: bookingData.date,
          preferred_time: bookingData.time
        });
        // Remove the JSON block from the display
        reply = reply.replace(/BOOKING_DATA: ({.*})/, '').trim();
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('Error sending message', err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having some trouble connecting. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto border rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="bg-blue-600 text-white p-4 flex items-center gap-2">
        <MessageSquare size={24} />
        <h2 className="font-semibold">{businessInfo?.business_name || 'Booking Assistant'}</h2>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg animate-pulse">...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-md px-3 py-2 outline-none focus:border-blue-500"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
