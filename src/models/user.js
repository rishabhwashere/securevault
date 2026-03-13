const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Make sure you import bcrypt!

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

// Remove 'next' entirely from the arguments
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  try {
    const salt = await require('bcryptjs').genSalt(10);
    this.password = await require('bcryptjs').hash(this.password, salt);
    // In an async function, you don't need to call next()
    // Returning is enough for Mongoose to know you're done!
  } catch (error) {
    throw error; 
  }
});

module.exports = mongoose.model('User', userSchema);