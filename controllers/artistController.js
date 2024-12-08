// controllers/userController.js
const album = require('../models/album');
const Artist = require('../models/artist');
const _ = require('lodash');

//Get All Artists
// 200, 400, 401
exports.getArtists = async (req, res) => {
  try {

     // Extract query parameters with default values
    const limit = parseInt(req.query.limit) || 5; // Default limit = 5
    const offset = parseInt(req.query.offset) || 0; // Default offset = 0
    const grammy = req.query.grammy; // No default; optional
    const hidden=req.query.hidden;

    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const filter = {};
    if (grammy) {
      filter.grammy = grammy; // Filter by role if provided
    }
    if(hidden){
      filter.hidden=hidden;
    }

    const artists = await Artist.find(filter).skip(offset).limit(limit);
    const totalItems = await Artist.countDocuments(filter);


    return res.status(200).json({
      status: 200,
      data: {
        artists, // Paginated artist data
        pagination: {
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: Math.floor(offset / limit) + 1,
          limit,
          offset,
        },
      },
      message: "Artists retrieved successfully.",
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


//Get Artist by ID
// 200,401, 403, 404
exports.getArtistById = async (req, res) => {
    try {


      if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized access.",
          error: null,
        });
      }

      const artist = await Artist.findById(req.params.id);
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
      res.json({
        status:200,
        data:artist,
        message:"Artist retrieved successfully",
        error:null,
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

//Add Artist 
// 201, 400, 401, 403, 409
exports.createArtist = async (req, res) => {
  try {
    
    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }
    
      const {name,grammy,hidden}=req.body;

      const existing=await Artist.findOne({name:name});

      if(existing){
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request: Already Existing",
          error: null,
        });
      }

      if (!name || grammy === undefined || hidden === undefined) {
        // Create an array to store the missing fields
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (grammy === undefined) missingFields.push("grammy");
        if (hidden === undefined) missingFields.push("hidden");
      
        // Return the response with the missing fields
        return res.status(400).json({
          status: 400,
          data: null,
          message: "Bad Request: Missing or invalid fields",
          error: `Missing fields: ${missingFields.join(", ")}`,
        });
      }

      const artist=new Artist({
        name:name,
        grammy:grammy,
        hidden:hidden,
      });

      const saveArtist= await artist.save();

      // Send a success response
      res.status(201).json({
        status: 201,
        data: saveArtist,
        message: "Artist created successfully.",
        error: null,

      });

  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: err.message,
    });
  }
 


};

//Delete Artist
// 200, 400, 401, 403, 404
exports.deleteArtist = async (req, res) => {
  try {

    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const deletedArtist=await Artist.findByIdAndDelete(req.params.id);
  
    if(deletedArtist){
      return res.status(200).json({
        status:200,
        data:null,
        message: `Artist '${deletedArtist.name}' deleted successfully.`,
        error:null,
      })
    }else{
      return res.status(404).json({
        status:404,
        data:null,
        message:"Artist Not Found",
        error:null,
      })
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "An error occurred while deleting the artist.",
      error: error.message,
  });
  }

};

exports.updateArtist = async (req, res) => {
  try {
    const { name, grammy, hidden } = req.body;

    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
        return res.status(404).json({
            status: 404,
            data: null,
            message: "Artist not found",
            error: null,
        });
    }

    // Update artist properties directly
    // artist.name = name;
    // artist.grammy = grammy;
    // artist.hidden = hidden;

    // Filter out undefined values from the request body
    const updates = _.pick(req.body, ['name', 'grammy', 'hidden']);

    // Update artist with the filtered updates
    Object.assign(artist, updates);

    // Save the updated artist instance
    const updatedArtist=await artist.save();
    
    return res.status(204).json({
        status: 204,
        data: updatedArtist,  
        message: "Artist updated successfully.",
        error: null,
    });

  } catch (error) {
      return res.status(400).json({
          status: 400,
          data: null,
          message: "An error occurred while updating the artist.",
          error: error.message,
      });
  }
};

