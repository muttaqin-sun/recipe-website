const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, authorizeAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', articleController.getAllArticles);

// Admin routes
router.get('/admin/all', protect, authorizeAdmin, articleController.getAllArticlesAdmin);

// User routes
router.post('/', protect, upload.single('image'), articleController.createArticle);
router.get('/user/me', protect, articleController.getUserArticles);
router.get('/user/liked', protect, articleController.getUserLikedArticles);
router.get('/user/commented', protect, articleController.getUserCommentedArticles);

// Dynamic routes
router.get('/:id', articleController.getArticleById);

// Update/delete/approve routes
router.put('/:id', protect, upload.single('image'), articleController.updateArticle);
router.delete('/:id', protect, authorizeAdmin, articleController.deleteArticle);
router.put('/:id/approve', protect, authorizeAdmin, articleController.approveArticle);

module.exports = router;
