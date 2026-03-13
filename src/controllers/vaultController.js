
const Vault = require('../models/vault'); 

const previewVaultData = async (req, res) => {
  try {
    const { data } = req.body;

    const vaultEntry = new Vault({
      title: req.body.title || 'Untitled Secret', 
      data: data,
      length: data.length,
      isEncrypted: false,
      storedAt: new Date()
    });

    await vaultEntry.save();

    res.status(201).json({
      status: 'stored',
      id: vaultEntry._id,
      title: vaultEntry.title,
      originalLength: vaultEntry.length,
      note: 'Data stored successfully'
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to store vault data'
    });
  }
};

const getAllVaultData = async (req, res) => {
  try {
    const vaults = await Vault.find().sort({ storedAt: -1 }); 

    res.status(200).json({
      status: 'success',
      totalItems: vaults.length,
      data: vaults
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve vault data'
    });
  }
};

module.exports = {
  previewVaultData,
  getAllVaultData 
};