const fs = require('fs');
const path = require('path');
const db = require('./config/db');

async function seed() {
  try {
    const sqlPath = path.join(__dirname, '../database/festivalhub.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolons for multiple statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Executing ${statements.length} statements...`);
    
    for (const stmt of statements) {
      await db.query(stmt);
    }
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
