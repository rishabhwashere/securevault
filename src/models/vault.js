const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema(
  {
   
    title: { 
      type: String,
      default: 'Untitled Secret'
    },
    data: {
      type: String,
      required: true
    },
    length: {
      type: Number,
      required: true
    },
   
    isEncrypted: { 
      type: Boolean,
      default: false
    },
    storedAt: {
      type: Date,
      default: Date.now // This automatically sets the current date!
    }
  },
  {
    collection: 'vault_data' 
  }
);

module.exports = mongoose.model('Vault', vaultSchema);