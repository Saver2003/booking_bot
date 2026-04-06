# Project Guidelines

## Overview

Telegram booking bot built with **Node.js + Telegraf v4** and **PostgreSQL**. Users go through a multi-step conversation flow (name → service → date); on completion, the booking is saved to the DB and a summary is sent to the admin.

## Architecture

```
index.js                   # entry point: loads .env, runs migrations, starts bot
src/
  config.js                # validates and exports env vars (throws on missing)
  bot/
    index.js               # createBot() — registers all handlers
    handlers/
      start.js             # /start command
      steps.js             # step machine + in-memory users session store
  db/
    pool.js                # pg.Pool singleton
    migrate.js             # runs migrations/001_create_bookings.sql on startup
    bookings.js            # saveBooking(), getBookings() queries
migrations/
  001_create_bookings.sql  # bookings table (CREATE TABLE IF NOT EXISTS)
```

- **`users` object** in `src/bot/handlers/steps.js` — in-memory session store, keyed by `ctx.from.id`; cleared after each booking completes
- **Three required env vars**: `BOT_TOKEN`, `ADMIN_ID`, `DATABASE_URL` (see `.env.example`)

## Build and Run

```bash
npm install      # install dependencies
npm start        # node index.js — runs migrations then starts bot
```

No test runner is configured. No build step.

## Conventions

- **Language**: UI strings and code comments are in Russian; keep new UI text in Russian.
- **Step machine**: conversation state is tracked via `user.step` (`'name'` → `'service'` → `'date'`). Add new steps by extending the chain in `src/bot/handlers/steps.js`.
- **Telegraf v4 API**: use `bot.hears()` for keyboard button text, `bot.on('text', ...)` for free-text input, `Markup.keyboard([...]).resize()` for reply keyboards.
- **DB queries**: use parameterised queries (`$1, $2, …`) in `src/db/bookings.js`; never interpolate user input into SQL strings.
- **Migrations**: add new SQL files under `migrations/` and `require()` them in `src/db/migrate.js`.
- **Environment**: secrets loaded via `dotenv`; never hard-code tokens or IDs; `src/config.js` throws at startup if any required var is missing.
