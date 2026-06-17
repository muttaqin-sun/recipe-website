const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST register user
router.post('/register', authController.register);

// POST login user
router.post('/login', authController.login);

// PUT update user profile (requires auth)
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
