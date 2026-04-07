const required = ['BOT_TOKEN', 'ADMIN_ID', 'DATABASE_URL', 'WEBHOOK_URL'];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Отсутствует обязательная переменная окружения: ${key}`);
    }
}

module.exports = {
    botToken:   process.env.BOT_TOKEN,
    adminId:    process.env.ADMIN_ID,
    webhookUrl: process.env.WEBHOOK_URL || null,
    port:       parseInt(process.env.PORT || '3000', 10),
    db: {
        connectionString: process.env.DATABASE_URL,
    },
};
