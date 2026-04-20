const mongoose = require('mongoose');

const connectDB = async () => {
  try {
   
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'securevault'
    });
    
    const { host, name } = mongoose.connection;
    console.log(` MongoDB connected successfully to "${name}" on "${host}"`);
    
   
    return mongoose.connection; 
    
  } catch (error) {
    
    console.error('❌ MONGODB CONNECTION ERROR:', error.message);
    
    throw error; 
  }
};

module.exports = connectDB;