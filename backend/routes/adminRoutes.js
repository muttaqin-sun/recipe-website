const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorizeAdmin, adminController.getDashboardStats);
router.get('/comments', protect, authorizeAdmin, adminController.getAllComments);
router.delete('/comments/recipe/:id', protect, authorizeAdmin, adminController.deleteRecipeComment);
router.delete('/comments/article/:id', protect, authorizeAdmin, adminController.deleteArticleComment);

// User management routes
router.get('/users', protect, authorizeAdmin, adminController.getAllUsers);
router.put('/users/:id', protect, authorizeAdmin, adminController.updateUser);
router.delete('/users/:id', protect, authorizeAdmin, adminController.deleteUser);

module.exports = router;
