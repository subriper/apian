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
        
        // تنظیمات درخواست به RapidAPI طبق عکسی که فرستادی
        const options = {
            method: 'GET',
            url: 'https://gogoanime2.p.rapidapi.com/recent-release', // می‌توانی آدرس را بر اساس نیاز (مثل popular یا top-airing) تغییر دهی
            params: {
                page: page,
                type: '1' // معمولاً 1 برای انیمه‌های ساب شده است
            },
            headers: {
                'x-rapidapi-key': '748d416499mshbb161b48db61a5dp1eb23cjsn80a9f87dbc23',
                'x-rapidapi-host': 'gogoanime2.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const data = response.data;

        // تبدیل داده‌های RapidAPI به فرمتی که سایت PHP تو می‌فهمد
        // در این API معمولاً خروجی به صورت آرایه مستقیم یا در فیلد results است
        const results = Array.isArray(data) ? data : (data.results || []);

        let animeList = results.map(anime => ({
            animeTitle: anime.animeTitle || anime.title,
            animeId: anime.animeId || anime.id,
            liTitle: anime.episodeNum ? `Episode ${anime.episodeNum}` : ""
        }));

        res.json(animeList);
    } catch (error) {
        console.error(error);
        res.status(500).json([{ animeTitle: "RapidAPI Error - Check Key", animeId: "#", liTitle: "" }]);
    }
});

app.get('/', (req, res) => res.send('RapidAPI Bridge is Active'));

module.exports = app;
