const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Recipes
    const [recipesCountRow] = await db.query('SELECT COUNT(*) as count FROM recipes');
    const totalRecipes = recipesCountRow[0]?.count || 0;

    // 2. Total Users
    const [usersCountRow] = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersCountRow[0]?.count || 0;

    // 3. Pending Recipes
    const [pendingRecipesCountRow] = await db.query("SELECT COUNT(*) as count FROM recipes WHERE status = 'pending'");
    const pendingRecipes = pendingRecipesCountRow[0]?.count || 0;

    // 4. Total Comments
    const [commentsCountRow] = await db.query(
      'SELECT (SELECT COUNT(*) FROM recipe_comments) + (SELECT COUNT(*) FROM article_comments) as count'
    );
    const totalComments = commentsCountRow[0]?.count || 0;

    // 5. Total Articles
    const [articlesCountRow] = await db.query('SELECT COUNT(*) as count FROM articles');
    const totalArticles = articlesCountRow[0]?.count || 0;

    // 6. Total Categories
    const [categoriesCountRow] = await db.query('SELECT COUNT(DISTINCT category) as count FROM recipes');
    const totalCategories = categoriesCountRow[0]?.count || 0;

    // 6b. Total Ingredients
    const [ingredientsCountRow] = await db.query('SELECT COUNT(DISTINCT ingredient) as count FROM recipe_ingredients');
    const totalIngredients = ingredientsCountRow[0]?.count || 0;

    // 7. Dynamic Chart data: count new and approved recipes for the last 7 days
    const [chartRows] = await db.query(
      `SELECT date(created_at) as date_str, 
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as resepBaru,
              SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as resepDisetujui
       FROM recipes 
       GROUP BY date_str 
       ORDER BY date_str DESC 
       LIMIT 7`
    );

    // Format chart data for recharts
    let chartData = chartRows.reverse().map(row => {
      const dateParts = row.date_str.split('-');
      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : row.date_str;
      return {
        name: formattedDate,
        resepBaru: row.resepBaru || 0,
        resepDisetujui: row.resepDisetujui || 0
      };
    });

    if (chartData.length === 0) {
      chartData = [
        { name: 'Hari ini', resepBaru: 0, resepDisetujui: 0 }
      ];
    }

    res.json({
      success: true,
      data: {
        totalRecipes,
        totalUsers,
        pendingRecipes,
        totalComments,
        totalArticles,
        totalCategories,
        totalIngredients,
        chartData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat memuat statistik dasbor' });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const query = `
      SELECT rc.id, rc.content, rc.created_at, 'recipe' as type, rc.recipe_id as target_id, r.name as target_name, u.name as user_name 
      FROM recipe_comments rc 
      JOIN users u ON rc.user_id = u.id 
      JOIN recipes r ON rc.recipe_id = r.id
      UNION ALL
      SELECT ac.id, ac.content, ac.created_at, 'article' as type, ac.article_id as target_id, a.title as target_name, u.name as user_name 
      FROM article_comments ac 
      JOIN users u ON ac.user_id = u.id 
      JOIN articles a ON ac.article_id = a.id
      ORDER BY created_at DESC
    `;
    const [rows] = await db.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat mengambil daftar komentar' });
  }
};

exports.deleteRecipeComment = async (req, res) => {
  try {
    await db.query('DELETE FROM recipe_comments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Komentar resep berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat menghapus komentar' });
  }
};

exports.deleteArticleComment = async (req, res) => {
  try {
    await db.query('DELETE FROM article_comments WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Komentar artikel berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat menghapus komentar' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, bio, location, instagram, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat mengambil daftar pengguna' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Semua field (nama, email, role) harus diisi' });
    }

    // Check if email is already taken by another user
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar untuk pengguna lain' });
    }

    await db.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role, id]
    );

    res.json({ success: true, message: 'Pengguna berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat memperbarui pengguna' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Prevent admin from deleting themselves
    if (req.user && req.user.id === userId) {
      return res.status(400).json({ success: false, message: 'Anda tidak dapat menghapus akun admin Anda sendiri' });
    }

    // 1. Get recipes created by this user
    const [recipes] = await db.query('SELECT id FROM recipes WHERE author_id = ?', [userId]);
    for (const r of recipes) {
      await db.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [r.id]);
      await db.query('DELETE FROM recipe_steps WHERE recipe_id = ?', [r.id]);
      await db.query('DELETE FROM recipe_likes WHERE recipe_id = ?', [r.id]);
      await db.query('DELETE FROM recipe_comments WHERE recipe_id = ?', [r.id]);
      await db.query('DELETE FROM saved_recipes WHERE recipe_id = ?', [r.id]);
      await db.query('DELETE FROM recipes WHERE id = ?', [r.id]);
    }

    // 2. Get articles created by this user
    const [articles] = await db.query('SELECT id FROM articles WHERE author_id = ?', [userId]);
    for (const a of articles) {
      await db.query('DELETE FROM article_comments WHERE article_id = ?', [a.id]);
      await db.query('DELETE FROM article_likes WHERE article_id = ?', [a.id]);
      await db.query('DELETE FROM articles WHERE id = ?', [a.id]);
    }

    // 3. Delete user's own interactions (likes, comments, saved) on other content
    await db.query('DELETE FROM recipe_likes WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM article_likes WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM recipe_comments WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM article_comments WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM saved_recipes WHERE user_id = ?', [userId]);

    // 4. Delete the user
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    res.json({ success: true, message: 'Pengguna beserta semua postingan dan interaksinya berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saat menghapus pengguna' });
  }
};
