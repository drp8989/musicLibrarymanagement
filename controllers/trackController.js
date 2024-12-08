// controllers/userController.js
const Track = require('../models/track');
const Artist=require('../models/artist');
const Album=require("../models/album");
const _ = require('lodash');



exports.getTracks = async (req, res) => {

  try {

    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }
    // Extract query parameters with default values
    const limit = parseInt(req.query.limit) || 5; // Default limit = 5
    const offset = parseInt(req.query.offset) || 0; // Default offset = 0
    const artistId = req.query.artist_id;
    const albumId = req.query.album_id; 
    const hidden=req.query.hidden;

    const filter = {};
    if (artistId) {
      filter.artist = artistId; 
    }
    if(albumId){
      filter.album=albumId;
    }
    if(hidden){
      filter.hidden=hidden;
    }

    const tracks = await Track.find(filter).populate('artist').populate('album').skip(offset).limit(limit).exec();
    const totalItems = await Album.countDocuments(filter);


    if (tracks.length === 0) {
     return res.status(404).json({
       status: 404,
       data: null,
       message: "No tracks found.",
       error: null,
     });
   }

    return res.json({
     status: 200,
     data: {
      tracks, // Paginated user data
       pagination: {
         totalItems,
         totalPages: Math.ceil(totalItems / limit),
         currentPage: Math.floor(offset / limit) + 1,
         limit,
         offset,
       },
     },
     message: "Tracks retrieved successfully.",
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


//Get user by ID
// 200, 400, 401, 403, 404
exports.getTrackById = async (req, res) => {

  try {
    // const { trackId } = req.params.id;

    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    // Find track by trackId and populate the related artist and album
    const track = await Track.findById(req.params.id)
      .populate('artist', 'name') // Populate only the 'name' field of the artist
      .populate('album', 'name') // Populate only the 'name' field of the album
      .exec();

    if (!track) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Track not found.",
        error: null,
      });
    }

    // Prepare the response data in the desired format
    const responseData = {
      status: 200,
      data: {
        track_id: track.track_id,
        artist_name: track.artist.name, // Access the populated artist's name
        album_name: track.album.name, // Access the populated album's name
        name: track.name,
        duration: track.duration,
        hidden: track.hidden
      },
      message: "Track retrieved successfully.",
      error: null,
    };

    res.status(200).json(responseData);
  } catch (err) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: err.message,
    });
  }
};

//Add user 
// 201, 400, 401, 403, 409
exports.addTrack = async (req, res) => {
  try {


    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }
    const { artist_id, album_id, name, duration, hidden } = req.body;

     // Check for missing data fields
     if (!artist_id || !album_id || !name || !duration || hidden === undefined) {
      return res.status(400).json({
          status: 400,
          data: null,
          message: "Missing Data Fields",
          error: null,
      });
  }

    // Find the artist by ID
    const artist = await Artist.findById(artist_id);
    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    // Find the album by ID
    const album = await Album.findById(album_id);
    if (!album) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Album not found.",
        error: null,
      });
    }

    // Create a new track
    const newTrack = new Track({
      name: name,
      duration: duration,
      artist: artist._id,
      album: album._id,
      hidden: hidden,
    });

    // Save the new track
    const savedTrack = await newTrack.save();

    // If the track is saved successfully, respond with 201 status
    if (savedTrack) {
      return res.status(201).json({
        status: 201,
        data: savedTrack,
        message: "Track is Saved",
        error: null,
      });
    }

  } catch (error) {
    // Handle any errors
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error.message,
    });
  }
    
};

//Delete User
// 200, 400, 401, 403, 404
exports.deleteTrack = async (req, res) => {
  try {


    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const deletedTrack=await Track.findByIdAndDelete(req.params.id);

    if (deletedTrack) {
      res.json({
        status: 200,
        data: null,
        message: "Track Deleted successfully.",
        error: null,
      });
    } else {
      res.status(404).json({ error: 'Track not found.' });
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

exports.updateTrack = async (req, res) => {
  try {

    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }
    
    const updates = _.pick(req.body, ['name', 'duration', 'hidden','artist_id','album_id']);



    const track=await Track.findById(req.params.id);

    Object.assign(track,updates)

    const updatedTrack=await track.save();
    
    res.status(204).json({
      status: 204,
      data: updatedTrack,
      message: "Track updated successfully.",
      error: null,
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: error.message,
    });
  }
};

