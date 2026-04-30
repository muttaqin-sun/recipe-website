const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// GET all recipes
router.get('/', recipeController.getAllRecipes);

// GET single recipe by ID
router.get('/:id', recipeController.getRecipeById);

module.exports = router;
