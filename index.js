const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/animeList', async (req, res) => {
    try {
        const page = req.query.page || 1;
        // آدرس دقیق بخش انیمه‌های زیرنویس شده Enma
        const targetUrl = `https://www.enma.lol/subbed-anime?page=${page}`;
        
        const { data } = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        let animeList = [];

        // کلاس‌های دقیق سایت Enma برای استخراج لیست
        $('.anime-list .item').each((i, el) => {
            const aTag = $(el).find('.info .name a');
            const title = aTag.text().trim();
            const href = aTag.attr('href') || "";
            
            if (title && href) {
                animeList.push({
                    animeTitle: title,
                    // تبدیل لینک به ID تمیز
                    animeId: href.split('/').pop(), 
                    liTitle: title
                });
            }
        });

        // اگر باز هم خالی بود، چک کردن کلاس جایگزین
        if (animeList.length === 0) {
            $('.grid .card').each((i, el) => {
                const aTag = $(el).find('a').first();
                animeList.push({
                    animeTitle: aTag.text().trim(),
                    animeId: aTag.attr('href').split('/').pop(),
                    liTitle: aTag.text().trim()
                });
            });
        }

        res.json(animeList);
    } catch (error) {
        res.status(500).json([{ animeTitle: "Connection Error to Enma", animeId: "#", liTitle: "" }]);
    }
});

app.get('/', (req, res) => res.send('Enma API is Online'));

module.exports = app;
