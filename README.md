# AI Website Booking Assistant

This project consists of a React frontend and an Express backend with a SQLite database.

## Prerequisites

- Node.js installed
- OpenAI API Key

## Setup

1. **Backend**:
   - Go to `backend/`
   - Create a `.env` file and add: `OPENAI_API_KEY=your_key_here`
   - Run `npm start` (if you add a start script) or `node index.js`

2. **Frontend**:
   - Go to `frontend/`
   - Run `npm install`
   - Run `npm run dev`

## Features

- **AI Chatbot**: Friendly receptionist that answers questions based on business info and collects booking details.
- **Leads Dashboard**: View and manage consultation requests.
- **Business Configuration**: Update the information the AI uses.
- **Persistent Storage**: Leads and business info are saved in a SQLite database.
