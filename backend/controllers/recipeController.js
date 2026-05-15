const db = require('../config/db');

exports.getAllRecipes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recipes WHERE status = 'approved' ORDER BY created_at DESC");
    
    // Map snake_case from DB to camelCase for Frontend
    const recipes = rows.map(r => ({
      ...r,
      cookingTime: r.cooking_time + ' menit'
    }));

    res.json({ success: true, data: recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllRecipesAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipes ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { name, category, cooking_time, difficulty, description, ingredients, steps } = req.body;
    const author_id = req.user.id;
    // status will default to 'pending' as defined in schema wait I added 'approved' as default...
    // Let's explicitly set status to 'pending'
    const status = 'pending';
    
    // Dummy image for now, or could come from body
    const image = req.body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';

    const insertRecipe = `INSERT INTO recipes (author_id, name, category, image, cooking_time, difficulty, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(insertRecipe, [author_id, name, category, image, parseInt(cooking_time) || 30, difficulty, description, status]);
    const recipeId = result.insertId;

    if (ingredients && Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        await db.query(`INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES (?, ?)`, [recipeId, ing]);
      }
    }

    if (steps && Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        await db.query(`INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)`, [recipeId, i + 1, steps[i]]);
      }
    }

    res.status(201).json({ success: true, message: 'Resep berhasil dikirim dan menunggu persetujuan admin.' });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ success: false, message: 'Server error saat membuat resep' });
  }
};

exports.approveRecipe = async (req, res) => {
  try {
    await db.query("UPDATE recipes SET status = 'approved' WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: 'Resep disetujui.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const [recipe] = await db.query('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    if (recipe.length === 0) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    
    // Fetch related items without ORM
    const [ingredients] = await db.query('SELECT * FROM recipe_ingredients WHERE recipe_id = ?', [req.params.id]);
    const [steps] = await db.query('SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number ASC', [req.params.id]);
    
    // Aggregate result
    const detailedRecipe = {
      ...recipe[0],
      cookingTime: recipe[0].cooking_time + ' menit',
      ingredients: ingredients.map(i => i.ingredient),
      steps: steps.map(s => s.instruction)
    };
    
    res.json({ success: true, data: detailedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
