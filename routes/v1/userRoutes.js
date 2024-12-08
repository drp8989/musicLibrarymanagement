const express = require('express');
const router = express.Router();

const userController=require('../../controllers/userController');
const { protect } = require('../../middleware/authMiddleWare');
const { roleAuthorization } = require('../../middleware/roleMiddleWare');

// Define routes and associate them with the corresponding controller methods

router.get('/users', protect, roleAuthorization(['Admin']), userController.getAllUsers);                // GET /api/users - Get all users

router.post('/users/add-user', protect, roleAuthorization(['Admin']),userController.addUser);          // POST /api/users - Create a new user

router.put('/users/update-password',protect, userController.updatePassword);    // PUT /api/users/:id - Update user by ID

router.delete('/users/:id',protect, roleAuthorization(['Admin']), userController.deleteUser);              // DELETE /api/users/:id - Delete user by ID

module.exports = router;
