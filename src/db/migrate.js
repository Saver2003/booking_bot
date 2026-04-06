const fs   = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
    const sql = fs.readFileSync(
        path.join(__dirname, '../../migrations/001_create_bookings.sql'),
        'utf8'
    );
    await pool.query(sql);
    console.log('Миграции выполнены ✅');
}

module.exports = migrate;
