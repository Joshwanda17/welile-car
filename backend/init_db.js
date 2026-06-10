const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log(`Connected to the SQLite database at ${dbPath}`);
    createTables();
  }
});

function createTables() {
  db.serialize(() => {
    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON;");

    // Create profiles table
    db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        residence TEXT DEFAULT NULL,
        avatar_url TEXT DEFAULT NULL,
        referral_code TEXT NOT NULL,
        referred_by TEXT DEFAULT NULL,
        assigned_agent TEXT DEFAULT NULL,
        wallet_balance REAL NOT NULL DEFAULT 0.00,
        total_deposits REAL NOT NULL DEFAULT 0.00,
        deposits_this_month REAL NOT NULL DEFAULT 0.00,
        growth_earned REAL NOT NULL DEFAULT 0.00,
        has_withdrawn_this_month INTEGER NOT NULL DEFAULT 0,
        savings_locked INTEGER NOT NULL DEFAULT 0,
        financing_unlocked INTEGER NOT NULL DEFAULT 0,
        financing_status TEXT DEFAULT 'Not Started',
        flagged INTEGER NOT NULL DEFAULT 0,
        selected_car_id TEXT DEFAULT NULL,
        selected_car_condition TEXT DEFAULT NULL,
        selected_car_price REAL DEFAULT NULL,
        last_deposit_date DATETIME DEFAULT NULL,
        last_growth_date DATETIME DEFAULT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        method TEXT DEFAULT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
      )
    `);

    // Create user_roles table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
        FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
      )
    `);

    // Create cfo_requests table
    db.run(`
      CREATE TABLE IF NOT EXISTS cfo_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_phone TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        details TEXT NOT NULL,
        requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
      )
    `);

    console.log("Database schema created successfully.");
  });

  db.close((err) => {
    if (err) {
      console.error('Error closing database', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
}
