const express = require('express');
const router = express.Router();
const artistController = require('../../controllers/artistController');
const { protect } = require('../../middleware/authMiddleWare');
const { roleAuthorization } = require('../../middleware/roleMiddleWare'); 


// Define routes and associate them with the corresponding controller methods
router.get('/artists',  protect, roleAuthorization(['Admin', 'Viewer', 'Editor']),artistController.getArtists);                    // GET /api/users - Get all users
router.get('/artists/:id', protect , roleAuthorization(['Admin', 'Viewer', 'Editor']), artistController.getArtistById);             // GET /api/users/:id - Get user by ID
router.post('/artists/add-artist', protect , roleAuthorization(['Admin', 'Viewer', 'Editor']),artistController.createArtist);      // POST /api/users - Create a new user
router.put('/artists/:id', protect , roleAuthorization(['Admin', 'Viewer', 'Editor']),artistController.updateArtist);              // PUT /api/users/:id - Update user by ID
router.delete('/artists/:id', protect , roleAuthorization(['Admin', 'Viewer', 'Editor']), artistController.deleteArtist);            // DELETE /api/users/:id - Delete user by ID

module.exports = router;
