const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

// All interaction routes require the user to be logged in (protected by JWT middleware)
router.use(protect);

// Recipes
router.post('/recipes/:id/like', interactionController.likeRecipe);
router.post('/recipes/:id/comment', interactionController.commentRecipe);
router.post('/recipes/:id/save', interactionController.saveRecipe);

// Articles
router.post('/articles/:id/like', interactionController.likeArticle);
router.post('/articles/:id/comment', interactionController.commentArticle);

module.exports = router;
