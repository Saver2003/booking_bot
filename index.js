require('dotenv').config();

const migrate    = require('./src/db/migrate');
const createBot  = require('./src/bot');

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES    = 10;

async function main() {
    await migrate();

    const bot = createBot();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await bot.launch();
            console.log('Бот запущен 🚀');

            process.once('SIGINT',  () => bot.stop('SIGINT'));
            process.once('SIGTERM', () => bot.stop('SIGTERM'));
            return;
        } catch (err) {
            const is409 = err.message && err.message.includes('409');
            if (is409 && attempt < MAX_RETRIES) {
                console.log(`Конфликт (попытка ${attempt}/${MAX_RETRIES}), повтор через ${RETRY_DELAY_MS / 1000} сек...`);
                await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            } else {
                throw err;
            }
        }
    }
}

main().catch((err) => {
    console.error('Ошибка запуска:', err.message);
    process.exit(1);
});