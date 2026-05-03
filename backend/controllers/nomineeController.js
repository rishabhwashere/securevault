const User = require('../models/user');

// Get current nominee
const getNominee = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user.nominee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add or Update nominee
const saveNominee = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        nominee: { name, email, isConfigured: true } 
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Nominee saved successfully', data: user.nominee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove nominee
const removeNominee = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        nominee: { name: null, email: null, isConfigured: false } 
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Nominee access revoked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNominee,
  saveNominee,
  removeNominee
};