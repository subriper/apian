const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/animeList', async (req, res) => {
    try {
        const page = req.query.page || 1;
        // فراخوانی لیست محبوب‌ترین انیمه‌های در حال پخش از Jikan
        const response = await axios.get(`https://api.jikan.moe/v4/top/anime`, {
            params: {
                page: page,
                filter: 'airing', // فقط انیمه‌هایی که در حال پخش هستند
                limit: 25 // تعداد انیمه در هر صفحه
            }
        });
        
        const results = response.data.data || [];

        // تبدیل داده‌های Jikan به فرمت استاندارد سایت شما
        const animeList = results.map(anime => ({
            animeTitle: anime.title_english || anime.title, // اولویت با اسم انگلیسی
            animeId: anime.mal_id, // آیدی عددی انیمه در MyAnimeList
            liTitle: `${anime.type} | Score: ${anime.score || 'N/A'}`
        }));

        res.json(animeList);
    } catch (error) {
        console.error("Jikan API Error:", error.message);
        res.status(500).json([{ animeTitle: "Service Temporarily Busy", animeId: "#", liTitle: "Please refresh" }]);
    }
});

app.get('/', (req, res) => res.send('Jikan API Bridge is Online'));

module.exports = app;
