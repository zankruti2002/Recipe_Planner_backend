const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes
router.get('/:id', protect, userController.fetchUserById);
router.put('/update/:id', protect, userController.updateUser);
router.delete('/delete/:id', protect, userController.deleteUser);

// Public routes
router.post('/login', userController.Login);
router.post('/register', userController.createNewUser);

module.exports = router;