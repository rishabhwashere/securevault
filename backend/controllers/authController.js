const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { getIO, onlineUsers } = require('../socket'); 
const { sendNomineeAlertEmail } = require('../utils/email');
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const requestNomineeLogin = async (req, res) => {
  const { ownerEmail, nomineeEmail, nomineePin, deviceInfo } = req.body;

  try {
    const user = await User.findOne({ email: ownerEmail });
    if (!user || !user.nominee || user.nominee.email !== nomineeEmail || user.nominee.pin !== nomineePin) {
      return res.status(401).json({ message: 'Invalid nominee credentials' });
    }
    user.activeLoginRequest = {
      isPending: true,
      deviceInfo: deviceInfo || 'Unknown Device',
      timestamp: new Date()
    };
    await user.save();
    if (onlineUsers && onlineUsers.has(user._id.toString())) {
      const io = getIO(); 
      io.to(user._id.toString()).emit('nominee_login_attempt', {
        deviceInfo: user.activeLoginRequest.deviceInfo,
        timestamp: user.activeLoginRequest.timestamp
      });
    } else {
      await sendNomineeAlertEmail(user.email, user.activeLoginRequest.deviceInfo);
    }

    res.status(200).json({ message: 'Request sent to owner', ownerId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const checkNomineeStatus = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const user = await User.findById(ownerId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.activeLoginRequest && user.activeLoginRequest.isPending) {
      return res.status(202).json({ status: 'pending' });
    }
    if (user.nomineeApproved) {
        user.nomineeApproved = false;
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: 'nominee' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        return res.status(200).json({ status: 'approved', token });
    }

    return res.status(403).json({ status: 'denied' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const resolveNomineeLogin = async (req, res) => {
  const { action } = req.body; 
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId);
    
    if (user.activeLoginRequest) {
      user.activeLoginRequest.isPending = false;
    }
    
    if (action === 'allow') {
        user.nomineeApproved = true; 
    } else {
        user.nomineeApproved = false;
    }

    await user.save();
    res.status(200).json({ message: `Access ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  requestNomineeLogin,
  checkNomineeStatus,
  resolveNomineeLogin
};