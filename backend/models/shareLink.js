const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const shareLinkSchema = new mongoose.Schema({
  vault: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vault',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Hash the password before saving to the database
shareLinkSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Automatically delete the link from MongoDB when it expires
shareLinkSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ShareLink', shareLinkSchema);