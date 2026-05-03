require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./socket'); // Import the new helper

const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const userRoutes = require('./routes/UserRoutes');
const activityRoutes = require('./routes/activityRoutes');
const sharedLinkRoutes = require('./routes/sharedLinkRoutes');

const app = express();
const server = http.createServer(app); 

// Initialize Socket.IO using the helper
const io = initSocket(server); 

const PORT = process.env.PORT || 3000;
const frontendDistDir = path.join(__dirname, '..', 'frontend', 'dist');
const nomineeRoutes = require('./routes/nomineeRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendDistDir));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/nominee', nomineeRoutes);

app.post('/api/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    body: req.body
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Secure Vault API is running',
    version: '3.0.0',
    endpoints: {
      users: '/api/users',
      vault: '/api/vault',
      activity: '/api/activity'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/shared', sharedLinkRoutes);
app.use('/api/shared', require('./routes/sharedRoutes'));

app.get('*', (req, res) => {
  if (!fs.existsSync(frontendDistDir)) {
    return res.status(503).json({
      message: 'Frontend build not found. Run `npm run build` or `npm run dev:frontend`.'
    });
  }

  res.sendFile(path.join(frontendDistDir, 'index.html'));
});

async function startServer() {
  try {
    const dbConnection = await connectDB();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Connected database: ${dbConnection.name || 'MongoDB'}`);
      console.log(`VaultX Home:    http://localhost:${PORT}/`);
      console.log(`Auth Register: http://localhost:${PORT}/api/auth/register`);
      console.log(`Auth Login:    http://localhost:${PORT}/api/auth/login`);
      console.log(`Users API:     http://localhost:${PORT}/api/users`);
      console.log(`Vault API:     http://localhost:${PORT}/api/vault`);
      console.log(`Upload API:    http://localhost:${PORT}/api/upload`);
      console.log(`Activity API:  http://localhost:${PORT}/api/activity`);
    });
  } catch (error) {
    console.error(" CRITICAL SERVER CRASH:");
    console.error(error);
    process.exit(1);
  }
}

startServer();