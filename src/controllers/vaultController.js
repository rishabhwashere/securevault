const Vault = require('../models/vault'); 
const ActivityLog = require('../models/activitylog');

const createVaultEntry = async (req, res) => {
  try {
    // console.log("FILE DATA:", req.file); 
    // console.log("BODY DATA:", req.body);

    const { title, data, category, tags,  } = req.body;
  
    let uploadedFiles = [];
  
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files.map(file => file.secure_url || file.path);
    }
  
  
  
    //   const filePath = req.files ? (req.files.secure_url || req.file.path) : null;
    
  //  if (!filePath) {
  //       return res.status(400).json({ success: false, message: "No file was received by the server." });
  //   }
    const vaultEntry = new Vault({
      title,
      data,
      category,
      tags,
      owner: req.user._id,
      filePath: uploadedFiles
    });

    await vaultEntry.save();

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
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const getAllVaultEntries = async (req, res) => {
  try {
    const vaults = await Vault.find({ owner: req.user._id })
      .populate('owner', 'name email') 
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
    
    let vaultEntry = await Vault.findById(req.params.id);

    if (!vaultEntry) {
      return res.status(404).json({ success: false, message: 'Vault entry not found' });
    }

  
    if (vaultEntry.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this entry' });
    }

    
    vaultEntry = await Vault.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } 
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

    
    if (vaultEntry.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this entry' });
    }
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
<<<<<<< HEAD
};
=======
};
>>>>>>> 7640d58b35117d32cb3c6356332f2c086582f9b3
