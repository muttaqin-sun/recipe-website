const Database = require('better-sqlite3');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Samakan nama database di semua file config
const dbName = process.env.DB_NAME || 'database.sqlite';
const dbPath = path.join(__dirname, '..', dbName);

// Instantiate SQLite synchronously
const db = new Database(dbPath);

// Create a wrapper to mock mysql2/promise interface so controllers don't need changing
const dbWrapper = {
  query: async (sql, params = []) => {
    try {
      const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
      if (isSelect) {
        const stmt = db.prepare(sql);
        const rows = stmt.all(params);
        return [rows, []]; // Mock [rows, fields]
      } else {
        const stmt = db.prepare(sql);
        const result = stmt.run(params);
        // Mock the result object of mysql2 for INSERT/UPDATE/DELETE
        return [{
          insertId: result.lastInsertRowid,
          affectedRows: result.changes
        }, []];
      }
    } catch (error) {
      throw error;
    }
  }
};

module.exports = dbWrapper;
