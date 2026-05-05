const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbName = process.env.DB_NAME || 'database.sqlite';
const dbPath = path.join(__dirname, dbName);

async function seed() {
  const db = new Database(dbPath);

  try {
    const salt = await bcrypt.genSalt(10);
    
    // Admin Creds
    const adminPass = await bcrypt.hash('admin123', salt);
    // User Creds
    const userPass = await bcrypt.hash('user123', salt);

    // Insert Admin
    const insert = db.prepare('INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    
    insert.run('Administrator', 'admin@rasanusantara.id', adminPass, 'admin');
    console.log('Admin account created: admin@rasanusantara.id / admin123');

    insert.run('User Biasa', 'user@email.com', userPass, 'user');
    console.log('User account created: user@email.com / user123');

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    db.close();
  }
}

seed();
