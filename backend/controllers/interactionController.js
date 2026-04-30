const db = require('../config/db');

// --- RECIPES INTERACTIONS ---

exports.likeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    // Check if already liked, if so, toggle (unlike)
    const [existingLike] = await db.query('SELECT * FROM recipe_likes WHERE user_id = ? AND recipe_id = ?', [userId, recipeId]);
    if (existingLike.length > 0) {
      await db.query('DELETE FROM recipe_likes WHERE id = ?', [existingLike[0].id]);
      return res.json({ success: true, message: 'Recipe unliked' });
    }

    // Like
    await db.query('INSERT INTO recipe_likes (user_id, recipe_id) VALUES (?, ?)', [userId, recipeId]);
    res.json({ success: true, message: 'Recipe liked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.commentRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

    await db.query('INSERT INTO recipe_comments (user_id, recipe_id, content) VALUES (?, ?, ?)', [userId, recipeId, content]);
    res.status(201).json({ success: true, message: 'Comment added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.saveRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.id;

    // Toggle save
    const [existingSave] = await db.query('SELECT * FROM saved_recipes WHERE user_id = ? AND recipe_id = ?', [userId, recipeId]);
    if (existingSave.length > 0) {
      await db.query('DELETE FROM saved_recipes WHERE id = ?', [existingSave[0].id]);
      return res.json({ success: true, message: 'Recipe removed from saved collection' });
    }

    await db.query('INSERT INTO saved_recipes (user_id, recipe_id) VALUES (?, ?)', [userId, recipeId]);
    res.json({ success: true, message: 'Recipe saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// --- ARTICLES INTERACTIONS ---

exports.likeArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.id;

    const [existingLike] = await db.query('SELECT * FROM article_likes WHERE user_id = ? AND article_id = ?', [userId, articleId]);
    if (existingLike.length > 0) {
      await db.query('DELETE FROM article_likes WHERE id = ?', [existingLike[0].id]);
      return res.json({ success: true, message: 'Article unliked' });
    }

    await db.query('INSERT INTO article_likes (user_id, article_id) VALUES (?, ?)', [userId, articleId]);
    res.json({ success: true, message: 'Article liked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.commentArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

    await db.query('INSERT INTO article_comments (user_id, article_id, content) VALUES (?, ?, ?)', [userId, articleId, content]);
    res.status(201).json({ success: true, message: 'Comment added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
