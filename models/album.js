const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const albumSchema = new mongoose.Schema({
    album_id: {
        type: 'UUID',
        default: () => randomUUID()
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    year: {
        type: Number,
        required: true,
    },
    hidden: {
        type: Boolean,
        required: true,
   
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist', // Reference to the Artist model
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
