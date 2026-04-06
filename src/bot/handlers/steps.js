const { Markup } = require('telegraf');
const { saveBooking } = require('../../db/bookings');
const config = require('../../config');

// Сессии в памяти: { [telegramId]: { step, name, service, date } }
const users = {};

function handleRecordButton(ctx) {
    users[ctx.from.id] = { step: 'name' };
    ctx.reply('Как тебя зовут?');
}

async function handleText(ctx) {
    const user = users[ctx.from.id];
    if (!user) return;

    if (user.step === 'name') {
        user.name = ctx.message.text;
        user.step = 'service';

        ctx.reply(
            'Выбери услугу:',
            Markup.keyboard([
                ['Маникюр', 'Стрижка'],
                ['Массаж'],
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

        const booking = await saveBooking({
            telegramId: ctx.from.id,
            name:       user.name,
            service:    user.service,
            date:       user.date,
        });

        await ctx.telegram.sendMessage(
            config.adminId,
            `📥 Новая заявка #${booking.id}:\n\n` +
            `👤 Имя: ${user.name}\n` +
            `💼 Услуга: ${user.service}\n` +
            `📅 Дата: ${user.date}`
        );

        ctx.reply('Спасибо! Мы скоро с тобой свяжемся ✅');

        delete users[ctx.from.id];
    }
}

module.exports = { handleRecordButton, handleText };
