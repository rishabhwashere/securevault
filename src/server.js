require('dotenv').config();
const uploadRoutes = require('./routes/uploadRoutes');
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const shareRoutes = require('./routes/shareRoutes'); // <-- Added

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'public');

app.use(express.json());
app.use(express.static(publicDir));

connectDB();

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Secure Vault API is running',
    version: '2.0.0'
  });
});

// Serve the visual HTML page for people clicking the shared link
app.get('/shared/:token', (req, res) => {
  res.sendFile(path.join(publicDir, 'shared.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/share', shareRoutes); // <-- Added

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(` Health Check:  http://localhost:${PORT}/`);
  console.log(` Auth Register: http://localhost:${PORT}/api/auth/register`);
  console.log(` Auth Login:    http://localhost:${PORT}/api/auth/login`);
  console.log(` Users API:     http://localhost:${PORT}/api/users`);
  console.log(` Vault API:      http://localhost:${PORT}/api/vault`);
  console.log(` Upload API:    http://localhost:${PORT}/api/upload`);
  console.log(` Activity API:  http://localhost:${PORT}/api/activity`);
  console.log(` Share API:     http://localhost:${PORT}/api/share`);
});