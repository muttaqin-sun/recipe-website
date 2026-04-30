const db = require('../config/db');

exports.getAllRecipes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM recipes ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
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
      ingredients,
      steps
    };
    
    res.json({ success: true, data: detailedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
