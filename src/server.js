require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Import Routes
const vaultRoutes = require('./routes/vaultRoutes');
const userRoutes = require('./routes/UserRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Test Endpoint (from GitHub version)
app.post('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    body: req.body
  });
});

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Secure Vault API is running',
    version: '2.0.0',
    endpoints: {
      users: '/api/users',
      vault: '/api/vault',
      activity: '/api/activity'
    }
  });
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/activity', activityRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/`);
  console.log(` Users API: http://localhost:${PORT}/api/users`);
  console.log(` Vault API: http://localhost:${PORT}/api/vault`);
  console.log(` Activity API: http://localhost:${PORT}/api/activity`);
});