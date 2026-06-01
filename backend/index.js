require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { setupDb } = require('./db');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-key-here'
});

let db;

setupDb().then(database => {
  db = database;
  console.log('Database initialized');
});

// Mock Chat endpoint (No OpenAI key required)
app.post('/api/chat', async (req, res) => {
  const { messages, businessInfo } = req.body;
  const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
  
  // Find the last assistant message to determine state
  const assistantMessages = messages.filter(m => m.role === 'assistant');
  const lastAssistantMessage = assistantMessages.length > 0 
    ? assistantMessages[assistantMessages.length - 1].content 
    : '';

  let reply = '';

  // Step 4 & 5: Collection Logic
  if (lastAssistantMessage.includes("May I have your name?")) {
    reply = "Thank you. May I have your phone number?";
  } else if (lastAssistantMessage.includes("May I have your phone number?")) {
    reply = "Thank you. May I have your email address?";
  } else if (lastAssistantMessage.includes("May I have your email address?")) {
    reply = "Thank you. What is your preferred date for the consultation?";
  } else if (lastAssistantMessage.includes("What is your preferred date")) {
    reply = "Thank you. What time would you prefer?";
  } else if (lastAssistantMessage.includes("What time would you prefer?")) {
    // Extract info from history for the confirmation
    const name = messages[messages.findIndex(m => m.content.includes("May I have your name?")) + 1]?.content || 'Customer';
    const phone = messages[messages.findIndex(m => m.content.includes("phone number?")) + 1]?.content || 'N/A';
    const email = messages[messages.findIndex(m => m.content.includes("email address?")) + 1]?.content || 'N/A';
    const date = messages[messages.findIndex(m => m.content.includes("preferred date")) + 1]?.content || 'TBD';
    const time = lastUserMessage;

    reply = `Perfect. I've recorded your consultation request for ${date} at ${time}. A team member will contact you shortly to confirm. \n\nBOOKING_DATA: {"name": "${name}", "phone": "${phone}", "email": "${email}", "date": "${date}", "time": "${time}"}`;
  } 
  // Step 3: Identify Interest
  else if (lastUserMessage.includes('yes') || lastUserMessage.includes('sure') || lastUserMessage.includes('ok')) {
    if (lastAssistantMessage.includes("schedule a quick consultation")) {
      reply = "Great. May I have your name?";
    } else {
      reply = "How else can I help you today?";
    }
  }
  else if (['book', 'interested', 'help', 'started', 'more'].some(k => lastUserMessage.includes(k))) {
    reply = "I'd be happy to help. Would you like to schedule a quick consultation with our team?";
  }
  // Step 2: Answer Questions (Mocked)
  else if (lastUserMessage.includes('price') || lastUserMessage.includes('cost')) {
    reply = `Our pricing is as follows: ${businessInfo.pricing}. Would you like to book a session?`;
  }
  else if (lastUserMessage.includes('service') || lastUserMessage.includes('do you offer')) {
    reply = `We offer: ${businessInfo.services}. Is there something specific you're looking for?`;
  }
  else if (lastUserMessage.includes('hours') || lastUserMessage.includes('open')) {
    reply = `We are open: ${businessInfo.hours}.`;
  }
  // Default
  else {
    reply = `I'm the ${businessInfo.business_name} assistant. I can tell you about our services, pricing, and hours, or help you book a consultation. What can I do for you?`;
  }

  // Simulate small delay
  setTimeout(() => {
    res.json({ reply });
  }, 500);
});

// Leads endpoints
app.get('/api/leads', async (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM leads';
  const params = [];
  if (status && status !== 'All') {
    query += ' WHERE status = ?';
    params.push(status);
  }
  query += ' ORDER BY created_at DESC';
  const leads = await db.all(query, params);
  res.json(leads);
});

app.post('/api/leads', async (req, res) => {
  const { name, phone, email, preferred_date, preferred_time } = req.body;
  await db.run(
    'INSERT INTO leads (name, phone, email, preferred_date, preferred_time, status) VALUES (?, ?, ?, ?, ?, ?)',
    [name, phone, email, preferred_date, preferred_time, 'Booking Requested']
  );
  res.json({ success: true });
});

app.patch('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await db.run('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
  res.json({ success: true });
});

// Business Info endpoints
app.get('/api/business-info', async (req, res) => {
  const rows = await db.all('SELECT * FROM business_info');
  const info = {};
  rows.forEach(row => {
    info[row.key] = row.value;
  });
  res.json(info);
});

app.post('/api/business-info', async (req, res) => {
  const info = req.body;
  for (const [key, value] of Object.entries(info)) {
    await db.run('INSERT OR REPLACE INTO business_info (key, value) VALUES (?, ?)', [key, value]);
  }
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
