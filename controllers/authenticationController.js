// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Add user
exports.signup = async (req, res) => {
  try {
    const { email, password, role, created_at } = req.body;

    // Assign default role "Viewer" if not provided
    const userRole = role || "Viewer";

    // Check if user exists in the system
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: "Email already exists",
        error: null,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      email,
      password: hashedPassword, // Use hashed password
      role: userRole,
      created_at: created_at || new Date(), // Use current date if not provided
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Send a success response
    return res.status(201).json({
      status: 201,
      data: savedUser,
      message: "User created successfully.",
      error: null,
    });
  } catch (err) {
    // Handle errors
    return res.status(500).json({
      status: 500,
      data: null,
      message: "Failed to create user.",
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {

  try {
    const { email, password } = req.body;

    if(!email || !password){
      res.json({
        status:400,
        data:null,
        message:"Bad Request,Reason:${Missing Field}",
        error:null,
      })
    }
    
    const user = await User.findOne({ email });
    
    if(!user){
      res.json({
        status:404,
        data:null,
        message:"User not found",
        error:null,
      })
    }
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(user.user_id);
    
    const token = jwt.sign({ userId: user._id,role:user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    res.status(200).json({ token });
  } catch (err) {
    
    res.status(400).json({ error: err.message });
  
  }
};

exports.logout=async(req,res)=>{
  try {

    res.setHeader('Authorization', '');
    // Redirect to the login page after logout
    return res.status(200).json("Logged out succesfully")
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Internal server error');
  }
}



