const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', recipeController.getAllRecipes);

// Admin routes
router.get('/admin/all', protect, authorizeAdmin, recipeController.getAllRecipesAdmin);

// User routes
router.post('/', protect, upload.single('image'), recipeController.createRecipe);
router.get('/user/me', protect, recipeController.getUserRecipes);
router.get('/user/saved', protect, recipeController.getUserSavedRecipes);
router.get('/user/liked', protect, recipeController.getUserLikedRecipes);
router.get('/user/commented', protect, recipeController.getUserCommentedRecipes);

// Dynamic routes
router.get('/:id', recipeController.getRecipeById);

// Admin routes (with id)
router.put('/:id/approve', protect, authorizeAdmin, recipeController.approveRecipe);
router.put('/:id', protect, upload.single('image'), recipeController.updateRecipe);
router.delete('/:id', protect, authorizeAdmin, recipeController.deleteRecipe);

module.exports = router;
