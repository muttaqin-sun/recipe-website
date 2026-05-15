const db = require('better-sqlite3')('database.sqlite');
try {
  db.exec("ALTER TABLE recipes ADD COLUMN status TEXT DEFAULT 'approved';");
  console.log("Added status to recipes.");
} catch(e) { console.error(e.message); }

try {
  db.exec("ALTER TABLE articles ADD COLUMN status TEXT DEFAULT 'approved';");
  console.log("Added status to articles.");
} catch(e) { console.error(e.message); }

db.close();
console.log("Migration finished.");
