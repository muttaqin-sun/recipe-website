const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// GET all articles
router.get('/', articleController.getAllArticles);

// GET single article by ID
router.get('/:id', articleController.getArticleById);

module.exports = router;
