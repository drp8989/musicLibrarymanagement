const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const trackSchema = new mongoose.Schema({
    track_id: {
        type: 'UUID',
        default: () => randomUUID()
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artist', // Reference to the Artist model
        required: true,
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album', // Reference to the Artist model
        required: true,
    },
    hidden: {
        type: Boolean,   
    },
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
