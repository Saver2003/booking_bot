const { Markup } = require('telegraf');

module.exports = (ctx) => {
    ctx.reply(
        'Привет! 👋\nХочешь записаться?',
        Markup.keyboard([['📅 Записаться']]).resize()
    );
};
