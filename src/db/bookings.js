const pool = require('./pool');

async function saveBooking({ telegramId, name, service, date }) {
    const result = await pool.query(
        `INSERT INTO bookings (telegram_id, name, service, date)
         VALUES ($1, $2, $3, $4)
         RETURNING id, created_at`,
        [telegramId, name, service, date]
    );
    return result.rows[0];
}

async function getBookings({ limit = 20, offset = 0 } = {}) {
    const result = await pool.query(
        `SELECT * FROM bookings ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
    );
    return result.rows;
}

module.exports = { saveBooking, getBookings };
