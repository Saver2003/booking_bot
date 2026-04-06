# Project Guidelines

## Overview

Telegram booking bot built with **Node.js + Telegraf v4**. Users go through a multi-step conversation flow (name → service → date); on completion, a summary is sent to the admin.

## Architecture

- **`index.js`** — single entry point; all bot logic lives here
- **`users` object** — in-memory session store, keyed by `ctx.from.id`; cleared after each booking completes
- **Two required env vars**: `BOT_TOKEN` (Telegram bot token), `ADMIN_ID` (Telegram user ID that receives booking notifications)

## Build and Run

```bash
npm install      # install dependencies
npm start        # node index.js
```

No test runner is configured. No build step.

## Conventions

- **Language**: UI strings and code comments are in Russian; keep new UI text in Russian.
- **Step machine**: conversation state is tracked via `user.step` (`'name'` → `'service'` → `'date'`). Add new steps by extending this chain.
- **Telegraf v4 API**: use `bot.hears()` for keyboard button text, `bot.on('text', ...)` for free-text input, `Markup.keyboard([...]).resize()` for reply keyboards.
- **No persistence**: the `users` store is in-memory and resets on restart. Do not add a database unless explicitly asked.
- **Environment**: secrets loaded via `dotenv`; never hard-code `BOT_TOKEN` or `ADMIN_ID`.
