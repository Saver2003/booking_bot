require('dotenv').config();

const migrate   = require('./src/db/migrate');
const createBot = require('./src/bot');
const config    = require('./src/config');

async function main() {
    await migrate();

    const bot = createBot();

    if (config.webhookUrl) {
        await bot.launch({
            webhook: {
                domain:   config.webhookUrl,
                port:     config.port,
                host:     '0.0.0.0',
                hookPath: '/webhook',
            },
        });
        console.log(`Бот запущен (webhook) на порту ${config.port} 🚀`);

        // В webhook-режиме НЕ вызываем bot.stop() — он удаляет webhook,
        // что ломает rolling-restart (новый инстанс уже зарегистрировал webhook,
        // а старый его удаляет при завершении).
        process.once('SIGINT',  () => process.exit(0));
        process.once('SIGTERM', () => process.exit(0));
    } else {
        await bot.launch();
        console.log('Бот запущен (polling) 🚀');

        process.once('SIGINT',  () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    }
}

main().catch((err) => {
    console.error('Ошибка запуска:', err.message);
    process.exit(1);
});