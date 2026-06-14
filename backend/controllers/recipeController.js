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

exports.getUserRecipes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipes WHERE author_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const { name, category, cooking_time, difficulty, description, origin, dish_type, suitable_for, portions, prep_time, tags } = req.body;
    const author_id = req.user.id;
    // status will default to 'pending' as defined in schema wait I added 'approved' as default...
    // Let's explicitly set status to 'pending'
    const status = 'pending';
    
    let image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }

    const insertRecipe = `INSERT INTO recipes (author_id, name, category, image, cooking_time, difficulty, description, status, origin, dish_type, suitable_for, portions, prep_time, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(insertRecipe, [
      author_id, name, category, image, 
      parseInt(cooking_time) || 30, difficulty, description, status,
      origin || '', dish_type || '', suitable_for || '', 
      parseInt(portions) || 4, parseInt(prep_time) || 15, tags || ''
    ]);
    const recipeId = result.insertId;

    let ingredients = req.body['ingredients[]'] || req.body.ingredients;
    if (typeof ingredients === 'string') ingredients = [ingredients];
    if (!ingredients) ingredients = [];

    let steps = req.body['steps[]'] || req.body.steps;
    if (typeof steps === 'string') steps = [steps];
    if (!steps) steps = [];

    if (ingredients.length > 0) {
      for (const ing of ingredients) {
        await db.query(`INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES (?, ?)`, [recipeId, ing]);
      }
    }

    if (steps.length > 0) {
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

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const [recipe] = await db.query('SELECT * FROM recipes WHERE id = ?', [id]);
    
    if (recipe.length === 0) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan' });
    }

    if (req.user.role !== 'admin' && recipe[0].author_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki izin untuk mengedit resep ini' });
    }

    const { name, category, cooking_time, difficulty, description, origin, dish_type, suitable_for, portions, prep_time, status, tags } = req.body;
    
    // Automatically revert status to pending if updated by a user
    let newStatus = status;
    if (req.user.role !== 'admin') {
      newStatus = 'pending';
    }

    let updateQuery = `UPDATE recipes SET 
      name = ?, category = ?, cooking_time = ?, difficulty = ?, description = ?,
      origin = ?, dish_type = ?, suitable_for = ?, portions = ?, prep_time = ?, tags = ?`;
    let queryParams = [
      name, category, parseInt(cooking_time) || 30, difficulty, description,
      origin || '', dish_type || '', suitable_for || '', parseInt(portions) || 4, parseInt(prep_time) || 15, tags || ''
    ];

    if (newStatus) {
      updateQuery += `, status = ?`;
      queryParams.push(newStatus);
    }
    
    if (req.file) {
      updateQuery += `, image = ?`;
      queryParams.push('/uploads/' + req.file.filename);
    }
    
    updateQuery += ` WHERE id = ?`;
    queryParams.push(id);

    await db.query(updateQuery, queryParams);
    
    // Update ingredients
    let ingredients = req.body['ingredients[]'] || req.body.ingredients;
    if (typeof ingredients === 'string') ingredients = [ingredients];
    if (ingredients && ingredients.length > 0) {
      await db.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [id]);
      for (const ing of ingredients) {
        if (ing.trim()) await db.query(`INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES (?, ?)`, [id, ing]);
      }
    }

    // Update steps
    let steps = req.body['steps[]'] || req.body.steps;
    if (typeof steps === 'string') steps = [steps];
    if (steps && steps.length > 0) {
      await db.query('DELETE FROM recipe_steps WHERE recipe_id = ?', [id]);
      let stepCount = 1;
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].trim()) {
          await db.query(`INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES (?, ?, ?)`, [id, stepCount, steps[i]]);
          stepCount++;
        }
      }
    }
    
    res.json({ success: true, message: req.user.role !== 'admin' ? 'Resep berhasil diperbarui dan kembali berstatus pending untuk direview.' : 'Resep berhasil diperbarui.' });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ success: false, message: 'Server error saat memperbarui resep' });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.query(`DELETE FROM recipe_ingredients WHERE recipe_id = ?`, [id]);
    await db.query(`DELETE FROM recipe_steps WHERE recipe_id = ?`, [id]);
    await db.query(`DELETE FROM saved_recipes WHERE recipe_id = ?`, [id]);
    await db.query(`DELETE FROM recipe_likes WHERE recipe_id = ?`, [id]);
    await db.query(`DELETE FROM recipe_comments WHERE recipe_id = ?`, [id]);
    
    await db.query(`DELETE FROM recipes WHERE id = ?`, [id]);
    
    res.json({ success: true, message: 'Resep berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ success: false, message: 'Server error saat menghapus resep' });
  }
};
