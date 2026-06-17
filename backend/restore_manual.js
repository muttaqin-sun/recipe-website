const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
  // Update user name
  db.prepare('UPDATE users SET name = ? WHERE email = ?').run('Ilham Muttaqin', 'user@email.com');
  console.log('User name updated to Ilham Muttaqin');

  // Get user id
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get('user@email.com');
  if (user) {
    // Insert Martabak Telur
    const insertRecipe = db.prepare(`
      INSERT INTO recipes (author_id, name, category, image, cooking_time, difficulty, rating, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Check if martabak already exists
    const m = db.prepare('SELECT id FROM recipes WHERE name = ?').get('Martabak Telur');
    if (!m) {
      const res = insertRecipe.run(user.id, 'Martabak Telur', 'Camilan', 'http://localhost:5000/uploads/1781443292820-Martabak-Telur.jpg', 30, 'Sedang', 4.8, 'Martabak telur gurih dan lezat.');
      console.log('Inserted Martabak Telur');
    }

    // Insert Ayam Geprek
    const a = db.prepare('SELECT id FROM recipes WHERE name = ?').get('Ayam Geprek');
    if (!a) {
      insertRecipe.run(user.id, 'Ayam Geprek', 'Makanan Berat', 'http://localhost:5000/uploads/1781449739826-Ayam-geprek.jpg', 45, 'Sedang', 4.9, 'Ayam geprek pedas dan nikmat.');
      console.log('Inserted Ayam Geprek');
    }
  }

  // Also check if article exists, user said "1 artikel". The original only had 1 article anyway, but let's just make sure.
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
