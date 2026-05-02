const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// مسیر جدید برای لیست انیمه‌ها که PHP دنبالش می‌گردد
app.get('/animeList', async (req, res) => {
    try {
        const page = req.query.page || 1;
        // آدرس سایت مرجع برای لیست انیمه‌ها
        const { data } = await axios.get(`https://gogoanime3.co/anime-list.html?page=${page}`);
        const $ = cheerio.load(data);
        let animeList = [];

        // استخراج لیست انیمه‌ها از سایت مرجع
        $('.listing li').each((i, el) => {
            animeList.push({
                animeTitle: $(el).find('a').text().trim(),
                animeId: $(el).find('a').attr('href').replace('/category/', ''),
                liTitle: $(el).attr('title') || ""
            });
        });

        // خروجی مستقیم به صورت آرایه (همان چیزی که PHP می‌خواهد)
        res.json(animeList);
    } catch (error) {
        res.status(500).json([]);
    }
});

// مسیر قبلی برای احتیاط
app.get('/api/recent', async (req, res) => {
    try {
        const { data } = await axios.get('https://gogoanime3.co/');
        const $ = cheerio.load(data);
        let animeList = [];
        $('.items li').each((i, el) => {
            animeList.push({
                title: $(el).find('.name').text().trim(),
                link: $(el).find('a').attr('href'),
                image: $(el).find('img').attr('src')
            });
        });
        res.json({ success: true, data: animeList });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

module.exports = app;
