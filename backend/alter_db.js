const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  const addColumn = (table, column, type) => {
    db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`Column ${column} already exists in ${table}.`);
        } else {
          console.error(`Error adding ${column} to ${table}:`, err.message);
        }
      } else {
        console.log(`Successfully added ${column} to ${table}.`);
      }
    });
  };

  addColumn('profiles', 'residence', 'TEXT DEFAULT NULL');
  addColumn('profiles', 'avatar_url', 'TEXT DEFAULT NULL');
  addColumn('profiles', 'selected_car_condition', 'TEXT DEFAULT NULL');
  addColumn('profiles', 'selected_car_price', 'REAL DEFAULT NULL');
});

db.close();
