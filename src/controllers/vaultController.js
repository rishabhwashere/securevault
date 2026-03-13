const Vault = require('../models/vault'); // Note: Ensure 'vault' case matches your file name
const ActivityLog = require('../models/activitylog');

const createVaultEntry = async (req, res) => {
  try {
    const { title, data, category, tags, owner } = req.body;

    const vaultEntry = new Vault({
      title,
      data,
      category,
      tags,
      owner: req.user._id
    });

    await vaultEntry.save();

    // Automaticaly log the activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'VAULT_CREATED',
      vault: vaultEntry._id,
      metadata: {
        title: title
      }
    });

    res.status(201).json({
      success: true,
      message: 'Vault entry created successfully',
      data: vaultEntry
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllVaultEntries = async (req, res) => {
  try {
    const vaults = await Vault.find({ owner: req.user._id })
      .populate('owner', 'name email') // Only show name and email of the owner
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vaults.length,
      data: vaults
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const updateVaultEntry = async (req, res) => {
  try {
    // 1. Find the vault entry by the ID in the URL
    let vaultEntry = await Vault.findById(req.params.id);

    if (!vaultEntry) {
      return res.status(404).json({ success: false, message: 'Vault entry not found' });
    }

    // 2. SECURITY CHECK: Make sure the logged-in user actually owns this note!
    if (vaultEntry.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this entry' });
    }

    // 3. Update the entry
    vaultEntry = await Vault.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Returns the updated document
    );

    res.status(200).json({ success: true, data: vaultEntry });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const deleteVaultEntry = async (req, res) => {
  try {
    const vaultEntry = await Vault.findById(req.params.id);

    if (!vaultEntry) {
      return res.status(404).json({ success: false, message: 'Vault entry not found' });
    }

    // SECURITY CHECK: Make sure the logged-in user owns this note!
    if (vaultEntry.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this entry' });
    }

    // Delete the entry
    await vaultEntry.deleteOne();

    res.status(200).json({ success: true, message: 'Vault entry deleted successfully' });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createVaultEntry,
  getAllVaultEntries,
  updateVaultEntry,
  deleteVaultEntry
};