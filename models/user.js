const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library for generating UUIDs

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: uuidv4, // Automatically generates a new UUID for user_id
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Editor', 'Viewer'],
        required: true,
    },
}, {
    timestamps: true, 
}, {
    _id: false 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
