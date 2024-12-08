// controllers/userController.js
const User = require('../models/user');
const bcrypt=require('bcrypt');

// Get All users
exports.getAllUsers = async (req, res) => {
  try {

    if (!req.user || req.user.role !== 'Admin') {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access. Admins only.",
        error: null,
      });
    }

     // Extract query parameters with default values
    const limit = parseInt(req.query.limit) || 5; // Default limit = 5
    const offset = parseInt(req.query.offset) || 0; // Default offset = 0
    const role = req.query.role; // No default; optional

    const filter = {};
    if (role) {
      filter.role = role; // Filter by role if provided
    }

    const users = await User.find(filter).skip(offset).limit(limit);
    const totalItems = await User.countDocuments(filter);


    res.status(200).json({
      status: 200,
      data: {
        users, // Paginated user data
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: Math.floor(offset / limit) + 1,
          limit,
          offset,
        },
      },
      message: "Users retrieved successfully.",
      error: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: err.message,
    });
  }
};

// Add user
exports.addUser = async (req, res) => {


  try {
    const { email,password, role, created_at } = req.body;



    if (!email || !password || !role) {
      // Create an array of missing fields
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!password) missingFields.push("password");
      if (!role) missingFields.push("role");
    
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request: Missing or invalid fields",
        error: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    if(role=="Admin"){
      res.json({
        status:403,
        data:null,
        message:"Forbidden access",
        error:null,
      })
    }

    const user= await User.findOne({email});
    
    if(user){
       return res.status(409).json({
        status:409,
        data:null,
        message:"Email already exists",
        error:null,
      })
    }

    const newUser = new User({
      email,
      role,
      password:await bcrypt.hash(password,10),
      created_at: created_at || new Date(), // Use current date if not provided
    });

    // Save the user to the database
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
    res.status(400).json({
      status: 400,
      data: null,
      message: "Failed to create user.",
      error: err.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {

    if(req.user.role !== 'Admin'){
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access. Admins only.",
        error: null,
      });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      return res.status(200).json({
        status: 200,
        data: null,
        message: "User Deleted successfully.",
        error: null,
      });
    } else {
      return res.status(404).json({ 
        status: 404,
        data: null,
        message: "User Not Found.",
        error:null 
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: err.message,
    });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {

  try {
    const {oldPassword,newPassword}=req.body;

    // const updateData=newPassword;
   
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request",
        error: err.message,
      });
    }


    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const user = await User.findOne({ user_id: req.user.userId });


    console.log(user);
    

    if (!user) {
      return res.status(404).json({  
        status: 404,
        data: null,
        message: "User not found",
        error: "User not found" 
      });
    }


  
    
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ 
        status: 400,
        data: null,
        message: "Bad Request",
        error: 'Old password doesnt match the password' });
    }
    // Object.assign(user,bcrypt.hash(updateData,10));
    user.password = await bcrypt.hash(newPassword, 10);
    const updateUser=await user.save();
    
    return res.status(200).json({
      status: 200,
      data: updateUser,
      message: "User updated successfully.",
      error: null,
    });


  } catch (err) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: err.message,
    });
  }
};
