const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// مسیر دریافت لیست انیمه‌های در حال پخش (Top Airing)
app.get('/animeList', async (req, res) => {
    try {
        const page = req.query.page || 1;
        
        // استفاده از سورس Gogoanime از طریق یک پروکسی پایدار
        // این دامین معمولا کمتر از دامین اصلی Consumet دچار اختلال می‌شود
        const targetUrl = `https://api.consumet.org/anime/gogoanime/top-airing?page=${page}`;
        
        // اگر دامین بالا ارور داد، از این لینک جایگزین (Mirror) استفاده کن:
        const mirrorUrl = `https://consumet-api-production-e633.up.railway.app/anime/gogoanime/top-airing?page=${page}`;

        const response = await axios.get(mirrorUrl); // من مستقیما روی میرور گذاشتم که قطعی نداشته باشی
        const results = response.data.results || [];

        const animeList = results.map(anime => ({
            animeTitle: anime.title,
            animeId: anime.id,
            liTitle: anime.genres ? anime.genres.join(', ') : "Trending Anime"
        }));

        res.json(animeList);
    } catch (error) {
        // در صورت خطای کامل، دیتای تستی برگردان تا سایت خالی نماند
        res.json([
            { animeTitle: "One Piece", animeId: "one-piece", liTitle: "Action" },
            { animeTitle: "Solo Leveling", animeId: "solo-leveling", liTitle: "Fantasy" },
            { animeTitle: "Connection Error", animeId: "#", liTitle: "Please Refresh" }
        ]);
    }
});

app.get('/', (req, res) => res.send('Anime API Bridge is Running'));

module.exports = app;
