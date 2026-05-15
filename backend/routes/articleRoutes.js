const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);

// User routes
router.post('/', protect, articleController.createArticle);

// Admin routes
router.get('/admin/all', protect, authorizeAdmin, articleController.getAllArticlesAdmin);
router.put('/:id/approve', protect, authorizeAdmin, articleController.approveArticle);

module.exports = router;
