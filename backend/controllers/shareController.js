const ShareLink = require('../models/ShareLink');
const Vault = require('../models/vault');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { decrypt } = require('../Utils/encryption');

const generateShareLink = async (req, res) => {
  try {
    const vaultId = req.params.vaultId || req.params.id;
    const { password } = req.body;
    
    console.log(`---> 1. Searching for Vault ID: ${vaultId}`);
    const vault = await Vault.findById(vaultId);
    if (!vault) {
        console.log("---> ERROR: This item completely vanished from the database!");
        return res.status(404).json({ message: 'Vault entry not found in database' });
    }
    const ownerId = vault.user || vault.userId || vault.owner;
    
    console.log(`---> 2. Item is owned by: ${ownerId}`);
    console.log(`---> 3. You are logged in as: ${req.user._id}`);

    if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
        console.log("---> ERROR: You do not own this item!");
        return res.status(401).json({ message: 'Unauthorized to share this item' });
    }

    console.log("---> 4. SUCCESS! Generating secure link...");
    
    const token = crypto.randomBytes(20).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    await ShareLink.create({ vaultEntryId: vaultId, token, passwordHash, expiresAt });

    res.status(201).json({ link: `/shared/${token}` });
  } catch (error) {
    console.log("---> CRASH ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const accessShareLink = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const share = await ShareLink.findOne({ token }).populate('vaultEntryId');
    if (!share) return res.status(404).json({ message: 'Link expired or invalid' });

    const isMatch = await bcrypt.compare(password, share.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const decryptedData = decrypt(share.vaultEntryId.data);

    res.json({
      success: true,
      data: {
        title: share.vaultEntryId.title,
        data: decryptedData,
        category: share.vaultEntryId.category,
        files: share.vaultEntryId.filePath 
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateShareLink,
  accessShareLink
};