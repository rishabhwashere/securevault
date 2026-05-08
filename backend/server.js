require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./socket'); 

const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const sharedLinkRoutes = require('./routes/sharedLinkRoutes');
const nomineeRoutes = require('./routes/nomineeRoutes');

const app = express();
const server = http.createServer(app); 

const io = initSocket(server); 

// --- 1. PORT CONFIGURATION ---
const PORT = process.env.PORT || 5000;

// --- 2. CORS CONFIGURATION ---
// This allows local Vite testing AND your deployed Vercel domain to talk to this API
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin, localhost, or ANY vercel.app domain
    if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (Useful for local testing, though Cloudinary handles production uploads)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- 3. API ROUTES ---
app.use('/api/nominee', nomineeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/shared', sharedLinkRoutes);
app.use('/api/shared', require('./routes/sharedRoutes'));

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

// --- 4. ROOT ROUTE (Replaces the old React Dist serving) ---
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'VaultX Backend is Live and Ready!',
    status: 'Active'
  });
});

// --- 5. SERVER INITIALIZATION ---
async function startServer() {
  try {
    const dbConnection = await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Connected database: ${dbConnection.name || 'MongoDB'}`);
    });

  } catch (error) {
    console.error("CRITICAL SERVER CRASH:");
    console.error(error);
    process.exit(1);
  }
}

startServer();