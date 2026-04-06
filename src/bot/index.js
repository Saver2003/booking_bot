const { Telegraf } = require('telegraf');
const config = require('../config');
const handleStart = require('./handlers/start');
const { handleRecordButton, handleText } = require('./handlers/steps');

function createBot() {
    const bot = new Telegraf(config.botToken);

    bot.start(handleStart);
    bot.hears('📅 Записаться', handleRecordButton);
    bot.on('text', handleText);

    return bot;
}

module.exports = createBot;
