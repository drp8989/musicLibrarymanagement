const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = require('./app');
const User=require('../models/user');
const bcrypt=require('bcrypt');
// Load environment variables
dotenv.config();

const mongoose = require('mongoose');

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Options to avoid deprecation warnings
const options = {
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
};

// Connect to MongoDB using Mongoose
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, options);
    console.log('Connected to the database.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};





connectToDatabase();
// Run the function
async function createDefaultAdmin() {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
      const defaultAdmin = new User({
          user_id: uuidv4(), // Generate a new UUID for user_id
          email: 'admin@admin.com',
          password: await bcrypt.hash('admin', 10), // This should be hashed
          role: 'Admin',
      });
      await defaultAdmin.save();
  }
}

// Call the function when the application starts or during the initialization phase
createDefaultAdmin();





// Server initialization
const PORT = process.env.PORT || 3000;

// Start the server and connect to the database

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
