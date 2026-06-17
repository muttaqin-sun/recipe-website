const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
  const stmt = db.prepare("UPDATE recipes SET created_at = datetime(created_at, '+7 hours') WHERE name LIKE '%bakso sapi kuah gurih%'");
  const info = stmt.run();
  console.log('Updated ' + info.changes + ' rows');
} catch (err) {
  console.error(err);
} finally {
  db.close();
}
