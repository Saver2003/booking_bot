require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Хранилище (временно в памяти)
const users = {};

// Старт
bot.start((ctx) => {
    ctx.reply(
        'Привет! 👋\nХочешь записаться?',
        Markup.keyboard([['📅 Записаться']]).resize()
    );
});

// Нажали "Записаться"
bot.hears('📅 Записаться', (ctx) => {
    users[ctx.from.id] = { step: 'name' };
    ctx.reply('Как тебя зовут?');
});

// Логика шагов
bot.on('text', (ctx) => {
    const user = users[ctx.from.id];

    if (!user) return;

    if (user.step === 'name') {
        user.name = ctx.message.text;
        user.step = 'service';

        ctx.reply(
            'Выбери услугу:',
            Markup.keyboard([
                ['Маникюр', 'Стрижка'],
                ['Массаж']
            ]).resize()
        );
    }

    else if (user.step === 'service') {
        user.service = ctx.message.text;
        user.step = 'date';

        ctx.reply('Напиши дату (например: 10 апреля)');
    }

    else if (user.step === 'date') {
        user.date = ctx.message.text;

        // Отправка админу
        bot.telegram.sendMessage(
            process.env.ADMIN_ID,
            `📥 Новая заявка:\n\n👤 Имя: ${user.name}\n💼 Услуга: ${user.service}\n📅 Дата: ${user.date}`
        );

        ctx.reply('Спасибо! Мы скоро с тобой свяжемся ✅');

        delete users[ctx.from.id];
    }
});

bot.launch();
console.log('Бот запущен 🚀');