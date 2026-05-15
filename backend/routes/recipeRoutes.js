const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

// User routes
router.post('/', protect, recipeController.createRecipe);

// Admin routes
router.get('/admin/all', protect, authorizeAdmin, recipeController.getAllRecipesAdmin);
router.put('/:id/approve', protect, authorizeAdmin, recipeController.approveRecipe);

module.exports = router;
