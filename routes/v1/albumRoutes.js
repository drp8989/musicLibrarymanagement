const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleWare');
const { roleAuthorization } = require('../../middleware/roleMiddleWare');
const albumController=require('../../controllers/albumController'); // Import controller methods

// Define routes and associate them with the corresponding controller methods
router.get('/albums', protect, roleAuthorization(['Admin', 'Viewer', 'Editor']),albumController.getAlbums);              // GET /api/users - Get all users
router.get('/albums/:id',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), albumController.getAlbumById);           // GET /api/users/:id - Get user by ID
router.post('/albums/add-album', protect, roleAuthorization(['Admin', 'Viewer', 'Editor']),albumController.createAlbum);              // POST /api/users - Create a new user
router.put('/albums/:id',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), albumController.updateAlbum);            // PUT /api/users/:id - Update user by ID
router.delete('/albums/:id',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), albumController.deleteAlbum);        // DELETE /api/users/:id - Delete user by ID

module.exports = router;