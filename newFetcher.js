const axios = require('axios');
const xml2js = require('xml2js');

const fetchNews = async () => {
  try {
    const url = 'https://feeds.feedburner.com/ndtvnews-top-stories';
    const response = await axios.get(url);
    const result = await xml2js.parseStringPromise(response.data);
    return result.rss.channel[0].item;
  } catch (error) {
    console.error('Error fetching or parsing the news:', error);
    return [];
  }
};

module.exports = fetchNews;
