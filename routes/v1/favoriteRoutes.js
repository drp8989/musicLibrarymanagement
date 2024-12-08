const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleWare');
const { roleAuthorization } = require('../../middleware/roleMiddleWare'); 

const favoriteController=require('../../controllers/favoriteController');


router.get('/favorites', protect, roleAuthorization(['Admin', 'Viewer', 'Editor']),favoriteController.getFavorites); 
router.post('/favorites/add-favorite',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), favoriteController.addFavorite);  
router.delete('/favorites/remove-favorite/:id',protect, roleAuthorization(['Admin', 'Viewer', 'Editor']), favoriteController.deleteFavorite);

module.exports = router;
