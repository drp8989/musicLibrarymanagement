const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes=require("../routes/v1/userRoutes");
const artistRoutes=require("../routes/v1/artistRoutes");
const albumRoutes=require('../routes/v1/albumRoutes');
const trackRoutes=require('../routes/v1/trackRoutes');
const favoriteRoutes=require('../routes/v1/favoriteRoutes');
const authRoutes=require('../routes/v1/authenticationRoutes');

const User=require('../models/user');



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

const PORT = process.env.PORT || 3000;

// Start the server and connect to the database

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



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



// Middleware
app.use(express.json());
app.use(bodyParser.json());

//Use the user routes
app.use("/api/v1",userRoutes);
app.use("/api/v1",artistRoutes);
app.use("/api/v1",albumRoutes);
app.use("/api/v1",trackRoutes);
app.use("/api/v1",favoriteRoutes);


app.use("/",authRoutes);

// Basic route
app.get('/', (req, res) => {
    console.log("Print")
    res.send('Hello, World!');
});

module.exports = app;
