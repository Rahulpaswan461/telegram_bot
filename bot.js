require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const xml2js = require('xml2js');
const express = require('express');
const bodyParser = require('body-parser');

// Replace with your actual Telegram bot token
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = `https://telegram-bot-1-ieom.onrender.com/webhook`; 
const bot = new TelegramBot(TOKEN);
const app = express();
const parser = new xml2js.Parser();

// Set up the webhook
bot.setWebHook(WEBHOOK_URL);

// Middleware
app.use(bodyParser.json());

app.get("/",(req,res)=>{
  return res.end("From the server")
})
// Route to handle webhook requests
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Fetch latest news from NDTV RSS feed
const fetchNews = async () => {
  try {
    const response = await axios.get('https://feeds.feedburner.com/ndtvnews-top-stories');
    const result = await parser.parseStringPromise(response.data);
    const latestNews = result.rss.channel[0].item[0];
    return latestNews.title[0];
  } catch (error) {
    console.error('Error fetching news:', error);
    return 'Error fetching news.';
  }
};

// Handle incoming messages
bot.onText(/\/news/, async (msg) => {
  const chatId = msg.chat.id;
  const news = await fetchNews();
  bot.sendMessage(chatId, `Latest News: ${news}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
