const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /api/support
// Body: { email, subject, message }
app.post('/api/support', async (req, res) => {
  const { email, subject, message } = req.body || {};
  if (!email || !subject || !message) {
    return res.status(400).json({ error: 'Missing email, subject or message' });
  }

  // If UVDesk config provided, forward request
  const uvdeskUrl = process.env.UV_DESK_API_URL; // full endpoint, e.g. https://help.example.com/api/tickets.json
  const uvdeskToken = process.env.UV_DESK_API_TOKEN;

  if (uvdeskUrl && uvdeskToken) {
    try {
      // Forward payload. The exact shape depends on your UVDesk setup.
      // We send a simple JSON payload and let the configured UVDesk endpoint map fields as needed.
      const resp = await axios.post(uvdeskUrl, {
        email,
        subject,
        message,
        source: 'matrixaccel_pro'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${uvdeskToken}`
        },
        timeout: 15000
      });

      return res.status(200).json({ ok: true, upstream: resp.data });
    } catch (err) {
      console.error('uvdesk forward error', err && err.toString());
      return res.status(502).json({ error: 'Failed to create ticket at upstream', details: (err && err.message) || String(err) });
    }
  }

  // Fallback: store locally in server/tickets.json for manual processing
  try {
    const ticketsPath = path.join(__dirname, 'tickets.json');
    let tickets = [];
    if (fs.existsSync(ticketsPath)) {
      tickets = JSON.parse(fs.readFileSync(ticketsPath, 'utf8') || '[]');
    }
    const ticket = { id: Date.now(), email, subject, message, createdAt: new Date().toISOString() };
    tickets.push(ticket);
    fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2));
    return res.status(200).json({ ok: true, ticket });
  } catch (err) {
    console.error('local store error', err && err.toString());
    return res.status(500).json({ error: 'Could not store ticket' });
  }
});

app.listen(PORT, () => {
  console.log(`Support API running on port ${PORT}`);
});
