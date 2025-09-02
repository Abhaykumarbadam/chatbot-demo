export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8003";

export async function getModels() {
  const r = await fetch(`${API_BASE}/models`);
  return r.json();
}

export async function createSession(user_id, title="New Chat") {
  const r = await fetch(`${API_BASE}/sessions`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ user_id, title })
  });
  return r.json();
}

export async function listSessions(user_id) {
  const r = await fetch(`${API_BASE}/sessions?user_id=${user_id}`);
  return r.json();
}


export async function getSession(session_id) {
  const r = await fetch(`${API_BASE}/sessions/${session_id}`);
  return r.json();
}

export async function saveSessionMessages(session_id, messages) {
  const r = await fetch(`${API_BASE}/sessions/${session_id}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });
  return r.json();
}

// // server.js

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();  // loads variables from .env

// const app = express();
// const PORT = process.env.PORT || 8003;

// // Allow origins for CORS
// const allowedOrigins = [
//   'http://localhost:5173',                  // local frontend
//   'https://your-frontend-app.vercel.app',  // deployed frontend URL — replace with your actual Vercel URL
// ];

// // CORS middleware
// app.use(cors({
//   origin: function(origin, callback) {
//     // allow requests with no origin (like mobile apps, curl, Postman)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `CORS policy does not allow access from origin: ${origin}`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,  // enable cookies/auth if needed
// }));

// // Built-in middleware to parse JSON request bodies
// app.use(express.json());

// // Example routes

// app.get('/models', (req, res) => {
//   // Example response, replace with your logic
//   res.json({ models: ['model1', 'model2', 'model3'] });
// });

// app.post('/sessions', (req, res) => {
//   const { user_id, title } = req.body;
//   // Your session creation logic here
//   res.json({ sessionId: 'new-session-id', user_id, title });
// });

// app.get('/sessions', (req, res) => {
//   const { user_id } = req.query;
//   // Your logic to list sessions by user_id
//   res.json({ sessions: [] });
// });

// app.get('/sessions/:session_id', (req, res) => {
//   const { session_id } = req.params;
//   // Your logic to get a session
//   res.json({ session_id, messages: [] });
// });

// app.post('/sessions/:session_id/messages', (req, res) => {
//   const { session_id } = req.params;
//   const { messages } = req.body;
//   // Your logic to save messages
//   res.json({ success: true, session_id, messages });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
