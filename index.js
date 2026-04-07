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
                domain: config.webhookUrl,
                port:   config.port,
                hookPath: '/webhook',
            },
        });
        console.log(`Бот запущен (webhook) на порту ${config.port} 🚀`);
    } else {
        await bot.launch();
        console.log('Бот запущен (polling) 🚀');
    }

    process.once('SIGINT',  () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch((err) => {
    console.error('Ошибка запуска:', err.message);
    process.exit(1);
});