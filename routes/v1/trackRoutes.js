const express = require('express');
const router = express.Router();

const { protect } = require('../../middleware/authMiddleWare');
const { roleAuthorization } = require('../../middleware/roleMiddleWare');

const trackController = require('../../controllers/trackController'); // Import controller methods

// Define routes and associate them with the corresponding controller methods
router.get('/tracks', protect, roleAuthorization(['Admin', 'Viewer', 'Editor']),trackController.getTracks);                 // GET /api/users - Get all users
router.get('/tracks/:id',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), trackController.getTrackById);          // GET /api/users/:id - Get user by ID
router.post('/tracks/add-track',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), trackController.addTrack);    // POST /api/users - Create a new user
router.put('/tracks/:id',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), trackController.updateTrack);           // PUT /api/users/:id - Update user by ID
router.delete('/tracks/:id',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), trackController.deleteTrack);         // DELETE /api/users/:id - Delete user by ID

module.exports = router;
