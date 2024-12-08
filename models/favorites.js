const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const favoritesSchema = new mongoose.Schema({
    favorite_id: {
        type: 'UUID',
        default: () => randomUUID()
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        enum: ['artist', 'album', 'track'], // Categories for favorites
        required: true,
    },
    item_id: {
        type: String, // UUID of the item
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Favorites', favoritesSchema);
