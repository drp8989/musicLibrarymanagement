// controllers/userController.js
const Album = require('../models/album');
const Artist=require("../models/artist");


//Get All users
// 200, 400, 401
exports.getAlbums = async (req, res) => {
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
     const artistId = req.query.artist_id; // No default; optional
     const hidden=req.query.hidden;
     
     const filter = {};
     if (artistId) {
       filter.artist = artistId; // Filter by role if provided
     }
     if(hidden){
      filter.hidden=hidden;
    }
 
     const albums = await Album.find(filter).populate('artist').skip(offset).limit(limit).exec();
     const totalItems = await Album.countDocuments(filter);
 
 
     if (albums.length === 0) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "No albums found for this artist.",
        error: null,
      });
    }

     return res.json({
      status: 200,
      data: {
        albums, // Paginated user data
        // pagination: {
        //   totalItems,
        //   totalPages: Math.ceil(totalItems / limit),
        //   currentPage: Math.floor(offset / limit) + 1,
        //   limit,
        //   offset,
        // },
      },
      message: "Albums retrieved successfully.",
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
exports.getAlbumById = async (req, res) => {
    try {
      if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized access.",
          error: null,
        });
      }
      const album = await Album.findById(req.params.id).populate('artist').exec();
      if (!album) {
        return res.status(404).json({
          status:404,
          data:null,
          message:"Album Not Found",
          error:null,
        })
      }
      return res.json({
        status:200,
        data:album,
        message:"Album retrived successfully!",
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

//Add user 
// 201, 400, 401, 403, 409
exports.createAlbum = async (req, res) => {
  try {

    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const{name,year,hidden,artistId}=req.body;

    if(name=="" || year=="" || hidden==undefined || artistId==""){
      return res.json({
        status:400,
        data:null,
        message:"Bad Request",
        error:"Missing Fields",
      })
    }
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "Artist not found.",
        error: null,
      });
    }

    const newalbum=new Album({
      name:name,
      year:year,
      hidden:hidden,
      artist:artist._id
    });

    const savedAlbum=await newalbum.save();

    if(savedAlbum){
      return res.json({
        status:201,
        data:savedAlbum,
        message:"Album is Saved",
        error:null,
      })
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

//Delete User
// 200, 400, 401, 403, 404
exports.deleteAlbum = async (req, res) => {
  try {
    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const deletedAlbum=await Album.findByIdAndDelete(req.params.id);
    
    if (deletedAlbum) {
      res.json({
        status: 200,
        data: null,
        message: "Album Deleted successfully.",
        error: null,
      });
    } else {
      return res.status(404).json({
        status:404,
        data:null,
        message:"Album Not Found",
        error:null,
      })
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "An error occurred while updating the album.",
      error: error.message,
  });
  }

};

exports.updateAlbum = async (req, res) => {
  try {
    if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
      return res.status(401).json({
        status: 401,
        data: null,
        message: "Unauthorized access.",
        error: null,
      });
    }

    const {name,year,hidden} =req.body;
   
    const album=await Album.findById(req.params.id);
    
    if(!album){

      return res.status(404).json({
        status:404,
        data:null,
        message:"Album not found",
        error:null,
      })

    }
    album.name=name;
    album.year=year;
    album.hidden=hidden;
    
    const updatedAlbum=await album.save();
    if(updatedAlbum){
      return res.status(204).json({
        status: 204,
        data: updatedAlbum,
        message: "Album updated successfully.",
        error: null,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "An error occurred while updating the artist.",
      error: error.message,
  });
  }
};

