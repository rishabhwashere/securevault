const User = require('../models/user');
const sendEmail = require('../utils/sendEmail'); 
const jwt = require('jsonwebtoken'); 
const crypto = require('crypto'); 

const getNominee = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user.nominee });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};

const saveNominee = async (req, res) => {
  try {
    const { name, email, pin } = req.body; 
    if (!name || !email || !pin) return res.status(400).json({ success: false, message: 'Missing fields' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nominee: { name, email, pin, isConfigured: true, accessStatus: 'idle', approvalToken: null } },
      { new: true }
    );
    res.status(200).json({ success: true, data: user.nominee });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};

const removeNominee = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { 
      nominee: { name: null, email: null, pin: null, isConfigured: false, accessStatus: 'idle' } 
    });
    res.status(200).json({ success: true, message: 'Nominee access revoked' });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};

const triggerNomineeAccessAlert = async (req, res) => {
  try {
    const { ownerEmail, nomineeEmail, nomineePin } = req.body;
    const mainUser = await User.findOne({ email: ownerEmail });

    if (!mainUser) {
      return res.status(404).json({ success: false, message: 'Vault Owner not found' });
    }

    if (!mainUser.nominee || !mainUser.nominee.isConfigured) {
      return res.status(403).json({ success: false, message: 'This owner has not set up a nominee yet.' });
    }

    if (mainUser.nominee.email !== nomineeEmail || mainUser.nominee.pin !== nomineePin) {
      return res.status(403).json({ success: false, message: 'Invalid credentials or PIN.' });
    }

    const approvalToken = crypto.randomBytes(20).toString('hex');
    mainUser.nominee.accessStatus = 'pending';
    mainUser.nominee.approvalToken = approvalToken;
    await mainUser.save();

    const approveUrl = `http://localhost:5000/api/nominee/approve/${approvalToken}`;
    const denyUrl = `http://localhost:5000/api/nominee/deny/${approvalToken}`;

    const emailMessage = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #e53e3e;">⚠️ URGENT: Vault Access Requested</h2>
        <p>Hello ${mainUser.name},</p>
        <p>Your nominee (<strong>${mainUser.nominee.name}</strong>) has entered their PIN and requested emergency access to your Vault.</p>
        <p>Do you authorize this access?</p>
        <div style="margin-top: 20px;">
          <a href="${approveUrl}" style="background-color: #48bb78; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px; display: inline-block;">✅ YES, Allow Access</a>
          <a href="${denyUrl}" style="background-color: #e53e3e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">❌ NO, Deny Access</a>
        </div>
      </div>
    `;

    await sendEmail({ email: mainUser.email, subject: 'ACTION REQUIRED: Vault Access Request', html: emailMessage });

    return res.status(200).json({ success: true, status: 'pending', ownerId: mainUser._id });
    
  } catch (error) { 
    console.error("Nominee Login Error:", error);
    return res.status(500).json({ success: false, message: 'Server Error: ' + error.message }); 
  }
};

const approveAccess = async (req, res) => {
  try {
    const user = await User.findOne({ "nominee.approvalToken": req.params.token });
    if (!user) return res.status(400).send('<h1>Link expired or invalid.</h1>');

    user.nominee.accessStatus = 'approved';
    user.nominee.approvalToken = null; 
    await user.save();

    res.send('<h1 style="color: green; text-align: center; margin-top: 50px;">Access Approved!</h1><p style="text-align: center;">Your nominee can now view the vault.</p>');
  } catch (error) { 
    res.status(500).send('Server Error'); 
  }
};

const denyAccess = async (req, res) => {
  try {
    const user = await User.findOne({ "nominee.approvalToken": req.params.token });
    if (!user) return res.status(400).send('<h1>Link expired or invalid.</h1>');

    user.nominee.accessStatus = 'denied';
    user.nominee.approvalToken = null; 
    await user.save();

    res.send('<h1 style="color: red; text-align: center; margin-top: 50px;">Access Denied!</h1><p style="text-align: center;">The nominee request has been rejected.</p>');
  } catch (error) { 
    res.status(500).send('Server Error'); 
  }
};

const checkAccessStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.ownerId);
    
    if (!user || !user.nominee) return res.status(404).json({ success: false, status: 'idle' });

    if (user.nominee.accessStatus === 'approved') {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
      
      user.nominee.accessStatus = 'idle';
      await user.save();

      return res.status(200).json({ 
        status: 'approved', token, 
        user: { _id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl }
      });
    }

    return res.status(200).json({ status: user.nominee.accessStatus }); // Returns 'pending' or 'denied'
  } catch (error) { 
    res.status(500).json({ success: false }); 
  }
};

module.exports = { getNominee, saveNominee, removeNominee, triggerNomineeAccessAlert, approveAccess, denyAccess, checkAccessStatus };