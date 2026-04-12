const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const ShareLink = require('../models/shareLink');
const Vault = require('../models/vault');

const generateShareLink = async (req, res) => {
  try {
    const { password, expiresInDays = 7 } = req.body;
    const vaultId = req.params.vaultId;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    // Verify the vault belongs to the user
    const vault = await Vault.findOne({ _id: vaultId, owner: req.user._id });
    if (!vault) {
      return res.status(404).json({ success: false, message: 'Vault entry not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    await ShareLink.create({ vault: vaultId, token, password, expiresAt });

    const link = `${req.protocol}://${req.get('host')}/shared/${token}`;
    res.status(201).json({ success: true, link, expiresAt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const accessShareLink = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const shareLink = await ShareLink.findOne({ token }).populate('vault');

    if (!shareLink) {
      return res.status(404).json({ success: false, message: 'Link invalid or expired' });
    }

    const isMatch = await bcrypt.compare(password, shareLink.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.status(200).json({
      success: true,
      data: {
        title: shareLink.vault.title,
        data: shareLink.vault.data,
        files: shareLink.vault.filePath
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateShareLink, accessShareLink };