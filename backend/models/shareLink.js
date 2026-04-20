const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
  
  vaultEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vault',
    required: true
  },
  
  token: {
    type: String,
    required: true,
    unique: true
  },
  
  passwordHash: {
    type: String,
    required: true
  },
 
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } 
  }
}, { timestamps: true });

module.exports = mongoose.model('ShareLink', shareLinkSchema);