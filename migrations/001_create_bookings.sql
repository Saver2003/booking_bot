CREATE TABLE IF NOT EXISTS bookings (
    id          SERIAL       PRIMARY KEY,
    telegram_id BIGINT       NOT NULL,
    name        VARCHAR(255) NOT NULL,
    service     VARCHAR(255) NOT NULL,
    date        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
