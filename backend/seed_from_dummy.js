const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const dotenv = require('dotenv');

dotenv.config();

const dbName = process.env.DB_NAME || 'database.sqlite';
const dbPath = path.join(__dirname, dbName);

// Helper to evaluate dummy data files
function getDummyData(filePath, varName) {
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(new RegExp(`export\\s+const\\s+${varName}\\s*=`), 'module.exports =');
  
  const tempPath = path.join(__dirname, `temp_${varName}.js`);
  fs.writeFileSync(tempPath, content);
  
  const data = require(`./temp_${varName}.js`);
  
  fs.unlinkSync(tempPath);
  return data;
}

function seed() {
  const db = new Database(dbPath);
  try {
    const admin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
    if (!admin) {
      console.error('Admin user not found, run seed_users.js first.');
      return;
    }
    const authorId = admin.id;

    console.log('Loading dummy data...');
    const recipesData = getDummyData(path.join(__dirname, '../frontend/src/data/recipes.jsx'), 'recipes');
    const articlesData = getDummyData(path.join(__dirname, '../frontend/src/data/articles.jsx'), 'articles');

    console.log(`Found ${recipesData.length} recipes and ${articlesData.length} articles.`);

    db.prepare('DELETE FROM recipe_ingredients').run();
    db.prepare('DELETE FROM recipe_steps').run();
    db.prepare('DELETE FROM recipes').run();
    db.prepare('DELETE FROM articles').run();

    const insertRecipe = db.prepare(`
      INSERT INTO recipes (id, author_id, name, category, image, cooking_time, difficulty, rating, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertIngredient = db.prepare(`
      INSERT INTO recipe_ingredients (recipe_id, ingredient)
      VALUES (?, ?)
    `);

    const insertStep = db.prepare(`
      INSERT INTO recipe_steps (recipe_id, step_number, instruction)
      VALUES (?, ?, ?)
    `);

    const insertArticle = db.prepare(`
      INSERT INTO articles (id, author_id, title, content, image, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Seed Recipes
    for (const recipe of recipesData) {
      let cookingTimeInt = 30; 
      if (typeof recipe.cookingTime === 'string') {
        const match = recipe.cookingTime.match(/\d+/);
        if (match) cookingTimeInt = parseInt(match[0]);
      } else if (typeof recipe.cookingTime === 'number') {
        cookingTimeInt = recipe.cookingTime;
      }

      insertRecipe.run(
        recipe.id,
        authorId,
        recipe.name,
        recipe.category,
        recipe.image,
        cookingTimeInt,
        recipe.difficulty,
        recipe.rating,
        recipe.description
      );

      for (const ing of recipe.ingredients) {
        insertIngredient.run(recipe.id, ing);
      }

      for (let i = 0; i < recipe.steps.length; i++) {
        insertStep.run(recipe.id, i + 1, recipe.steps[i]);
      }
    }

    // Seed Articles
    for (const article of articlesData) {
      let content = article.content;
      if (Array.isArray(content)) {
        content = content.join('\n\n');
      }
      
      // Store excerpt as part of the database if we could, but we don't have the column. 
      // We'll rely on the frontend substring logic, or we can prepend it to content.
      // Prepending it ensures it's not lost.
      if (article.excerpt) {
        content = `EXCERPT: ${article.excerpt}\n\n${content}`;
      }

      insertArticle.run(
        article.id,
        authorId,
        article.title,
        content,
        article.image,
        article.date
      );
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    db.close();
  }
}

seed();
