require("dotenv").config()
const TelegramBot = require('node-telegram-bot-api');
const fetchNews = require('./newFetcher');

const token = process.env.TOKEN
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const newsItems = await fetchNews();

  let response = 'Latest News from NDTV:\n\n';
  newsItems.slice(0, 5).forEach((item, index) => {
    response += `${index + 1}. ${item.title[0]}\n${item.link[0]}\n\n`;
  });

  bot.sendMessage(chatId, response);
});

console.log('Bot is running...');
