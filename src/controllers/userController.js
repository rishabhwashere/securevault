const User = require('../models/user'); 
const bcrypt = require('bcrypt');      
const registerUser = async (req, res) => {
  try {
  
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide name, email, and password' 
      });
    }

   
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'User already exists with this email' 
      });
    }

    
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword 
    });

    
    await newUser.save();

    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
        
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
};

module.exports = {
  registerUser
};