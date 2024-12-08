const Artist = require('../models/artist');
const Album = require('../models/album');
const Track = require('../models/track');
const Favorites=require('../models/favorites');

exports.getFavorites=async (req, res) => {
    try {

        if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
            return res.status(401).json({
            status: 401,
            data: null,
            message: "Unauthorized access.",
            error: null,
            });
        }

    

        const limit = parseInt(req.query.limit) || 5; // Default limit = 5
        const offset = parseInt(req.query.offset) || 0; // Default offset = 0
        const {category}=req.query;
        
        const filter = {};
        if (category) {
          filter.category = category; // Filter by category if provided
        }

        let totalItems = 0;
        
        if (category) {
          totalItems = await Favorites.countDocuments({
              user: req.user.userId,
              category: category,
          });
      }
        

        // Retrieve favorites for the logged-in user
        const favorites = await Favorites.findOne({ user: req.user.userId })
            .find( filter) // Use the prepared filter
            .populate('user', 'name email') // Populate user details
            .skip(offset).limit(limit) // Pagination
            .exec();

        // Check if no favorites found
        if (favorites=="") {
            return res.status(404).json({ message: 'No favorites found for the given category.' });
        }

    
        return res.json({
            status: 200,
            data: {
                favorites, // Paginated user data
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


    } catch (error) {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: error.message,
        });
    }

};

exports.addFavorite=async (req, res) => {
    try {
        const { category, item_id } = req.body;


        //Using Object Id 
        if(category=="artist"){
            const itemArtist=await Artist.findById(item_id);
            if(!itemArtist){
                return res.status(404).json({
                    status: 404,
                    data: null,
                    message: "Artist id not found.",
                    error: null,
                  });
            }
        }

        if(category=="album"){
            const itemAlbum=await Album.findById(item_id);
            if(!itemAlbum){
                return res.status(404).json({
                    status: 404,
                    data: null,
                    message: "Album id not found.",
                    error: null,
                  });
            }
        }

        if(category=="track"){
            const itemTrack=await Track.findById(item_id);
            if(!itemTrack){
                return res.status(404).json({
                    status: 404,
                    data: null,
                    message: "Track id not found.",
                    error: null,
                  });
            }
        }


        if (!['artist', 'album', 'track'].includes(category)) {
          return res.status(400).json({
            status: 400,
            data:null,
            message: 'Invalid category.',
            error:null,
          });
        }
    
        const favorite = new Favorites({
          user: req.user.userId, 
          category,
          item_id,
        });
    
        const savedfavorite=await favorite.save();
    
        res.status(201).json({
          status: 201,
          data: savedfavorite,
          message: 'Favorite added successfully.',
        });
      } catch (err) {
        res.status(500).json({
          status: 500,
          data: null,
          message: 'Server error occurred.',
          error: err.message,
        });
      }
};

exports.deleteFavorite=async(req,res)=>{
  try {

      if (!['Admin', 'Viewer', 'Editor'].includes(req.user.role)) {
        return res.status(401).json({
          status: 401,
          data: null,
          message: "Unauthorized access.",
          error: null,
        });
      }

      const deletedFavorite=await Favorites.findByIdAndDelete(req.params.id);

      if(deletedFavorite){
        return res.status(200).json({
          status:200,
          data:null,
          message: `Favorite deleted successfully.`,
          error:null,
        })
      }else{
        return res.status(404).json({
          status:404,
          data:null,
          message:"Favorite Not Found",
          error:null,
        })
      }s

  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: null,
      message: "An error occurred while deleting the artist.",
      error: error.message,
  });
  }
};