const mongoose = require('mongoose');
const { encrypt } = require('../Utils/encryption'); 

const vaultSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    data: {
      type: String,
      required: true,
      set: (value) => {
        if (value === undefined || value === null) return value;
        return encrypt(value); 
      }
    },
    category: {
      type: String,
      default: 'General'
    },
    url: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: '',
      set: (value) => {
        if (value === undefined || value === null || value === '') return value;
        return encrypt(value);
      }
    },
    notes: {
      type: String,
      default: '',
      set: (value) => {
        if (value === undefined || value === null || value === '') return value;
        return encrypt(value);
      }
    },
    tags: [
      {
        type: String
      }
    ],
    filePath: {
      type: [String],
      default: []
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'vault_data'
  }
);

module.exports = mongoose.model('Vault', vaultSchema);
