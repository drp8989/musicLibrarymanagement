const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const artistSchema = new mongoose.Schema({
    artist_id: {
        type: String,
        default: uuidv4, // Automatically generates a new UUID for user_id
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    grammy: {
        type: Boolean,
        required: true,
    },
    hidden: {
        type: Boolean,
        required: true,
   
    },
}, { timestamps: true },{
    _id: false 
});

module.exports = mongoose.model('Artist', artistSchema);
