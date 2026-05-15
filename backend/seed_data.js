const Database = require('better-sqlite3');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbName = process.env.DB_NAME || 'database.sqlite';
const dbPath = path.join(__dirname, dbName);

// Data Resep dari dummy (frontend/src/data/recipes.jsx)
const recipesData = [
  {
    id: 1,
    name: "Nasi Goreng",
    category: "Makanan Berat",
    image: "https://images.unsplash.com/photo-1611506168759-1e69a83b5a53?w=500&auto=format&fit=crop&q=60",
    cookingTime: 15,
    difficulty: "Mudah",
    rating: 4.8,
    description: "Nasi goreng klasik dengan bumbu rempah khas nusantara, disajikan dengan telur mata sapi dan kerupuk.",
    ingredients: ["2 piring nasi putih dingin", "2 butir telur", "3 siung bawang merah", "2 siung bawang putih", "2 batang daun bawang, iris tipis", "Kecap manis secukupnya", "Garam dan merica secukupnya", "Minyak goreng"],
    steps: ["Haluskan bawang merah dan bawang putih.", "Panaskan minyak, tumis bumbu halus hingga harum.", "Masukkan telur, orak-arik hingga matang.", "Tambahkan nasi putih, aduk rata dengan bumbu.", "Tuangkan kecap manis, garam, merica, dan daun bawang. Aduk rata.", "Sajikan selagi hangat."]
  },
  {
    id: 2,
    name: "Rendang",
    category: "Tradisional",
    image: "https://images.unsplash.com/photo-1740993382497-65dba6c7a689?w=500&auto=format&fit=crop&q=60",
    cookingTime: 180,
    difficulty: "Sulit",
    rating: 4.9,
    description: "Olahan daging sapi dengan rempah-rempah yang dimasak lama dalam santan hingga kering dan berwarna gelap kekuningan.",
    ingredients: ["500g daging sapi, potong dadu", "1 liter santan kental", "1 batang serai, memarkan", "3 lembar daun jeruk", "2 lembar daun salam", "Bumbu halus (cabai, bawang merah, bawang putih, jahe, lengkuas, kunyit)"],
    steps: ["Masak santan bersama bumbu halus, serai, daun jeruk, dan daun salam.", "Aduk terus hingga santan mengeluarkan minyak.", "Masukkan daging sapi, aduk rata dan masak dengan api kecil.", "Lanjutkan memasak hingga bumbu meresap dan daging empuk serta kuah mengering.", "Angkat dan sajikan."]
  },
  {
    id: 3,
    name: "Sate Ayam",
    category: "Makanan Berat",
    image: "https://plus.unsplash.com/premium_photo-1669150852115-38eb25f072e0?w=500&auto=format&fit=crop&q=60",
    cookingTime: 45,
    difficulty: "Sedang",
    rating: 4.7,
    description: "Potongan daging ayam yang ditusuk lidi rotan/bambu, dibakar dengan bumbu kecap dan disajikan dengan bumbu kacang.",
    ingredients: ["500g fillet ayam, potong dadu", "Tusuk sate secukupnya", "250g kacang tanah goreng, haluskan", "Kecap manis secukupnya", "Jeruk limau", "Bawang merah iris"],
    steps: ["Tusuk daging ayam pada tusuk sate.", "Campurkan kacang tanah halus, kecap, sedikit air, dan perasan jeruk limau untuk bumbu.", "Celupkan sate mentah pada sebagian bumbu kacang (tambahkan sisa kecap).", "Bakar sate hingga matang dan berwarna kecoklatan.", "Sajikan sate dengan siraman sisa bumbu kacang dan irisan bawang merah."]
  }
  // ... Tambahkan data lainnya jika perlu, atau gunakan subset ini untuk demo
];

// Data Artikel dari dummy (frontend/src/data/articles.jsx)
const articlesData = [
  {
    id: 1,
    title: "Cara Membuat Sambal Tahan Lama",
    image: "https://images.unsplash.com/photo-1613653739328-e86ebd77c9c8?w=500&auto=format&fit=crop&q=60",
    excerpt: "Tips dan trik menyimpan sambal ulek agar awet berminggu-minggu tanpa bahan pengawet buatan.",
    date: "2023-10-12",
    content: "Sambal adalah pelengkap wajib bagi kebanyakan orang Indonesia. Namun, sambal buatan rumah sering kali cepat basi jika tidak disimpan dengan benar.\n\nPertama, pastikan semua alat yang digunakan dalam keadaan bersih dan kering. Ulekan, sendok, maupun toples kaca tempat menyimpan sambal tidak boleh basah, karena air adalah musuh utama yang membuat sambal cepat berjamur.\n\nKedua, gunakan minyak secukupnya saat menumis sambal. Minyak berfungsi sebagai pengawet alami. Pastikan sambal ditumis dengan api kecil hingga benar-benar matang dan mengeluarkan minyak dengan sendirinya."
  }
];

function seed() {
  const db = new Database(dbPath);
  
  try {
    // Pastikan ada user admin untuk menjadi author
    const admin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
    if (!admin) {
      console.error('Lakukan node seed_users.js terlebih dahulu!');
      return;
    }
    const authorId = admin.id;

    console.log('Memulai proses seeding data...');

    // Clear existing data to avoid duplicates if needed
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
      insertRecipe.run(
        recipe.id,
        authorId,
        recipe.name,
        recipe.category,
        recipe.image,
        recipe.cookingTime,
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
      console.log(`- Resep "${recipe.name}" berhasil diimpor.`);
    }

    // Seed Articles
    for (const article of articlesData) {
      insertArticle.run(
        article.id,
        authorId,
        article.title,
        article.content,
        article.image,
        article.date
      );
      console.log(`- Artikel "${article.title}" berhasil diimpor.`);
    }

    console.log('\nSeeding selesai! Data sudah siap di database SQLite.');
  } catch (error) {
    console.error('Error saat seeding:', error);
  } finally {
    db.close();
  }
}

seed();
