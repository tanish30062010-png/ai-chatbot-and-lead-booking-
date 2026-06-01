const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDb() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      email TEXT,
      preferred_date TEXT,
      preferred_time TEXT,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS business_info (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Seed default business info if empty
  const count = await db.get('SELECT COUNT(*) as count FROM business_info');
  if (count.count === 0) {
    const defaultInfo = [
      ['business_name', 'Wellness Spa'],
      ['services', 'Massage, Facial, Manicure, Pedicure'],
      ['pricing', 'Massage: $80, Facial: $60, Manicure: $30, Pedicure: $40'],
      ['faqs', 'Q: Do you offer gift cards? A: Yes, we do! Q: Is there parking? A: Yes, free parking is available.'],
      ['hours', 'Mon-Fri: 9am - 8pm, Sat-Sun: 10am - 6pm'],
      ['contact', 'Phone: 555-0123, Email: hello@wellnessspa.com']
    ];
    for (const [key, value] of defaultInfo) {
      await db.run('INSERT INTO business_info (key, value) VALUES (?, ?)', [key, value]);
    }
  }

  return db;
}

module.exports = { setupDb };
