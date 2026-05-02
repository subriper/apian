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
        
        // استفاده از یک میرور پایدار و تست شده که دچار DMCA نشده است
        const targetUrl = `https://consumet-api-production-e633.up.railway.app/anime/gogoanime/top-airing?page=${page}`;

        const response = await axios.get(targetUrl, { timeout: 8000 });
        const results = response.data.results || [];

        if (results.length > 0) {
            const animeList = results.map(anime => ({
                animeTitle: anime.title,
                animeId: anime.id,
                liTitle: anime.genres ? anime.genres.slice(0, 2).join(', ') : "Trending"
            }));
            return res.json(animeList);
        }
        
        throw new Error("Empty Results");

    } catch (error) {
        // دیتای جایگزین (Fallback) در صورت قطعی موقت ای‌پی‌آی
        res.json([
            { animeTitle: "One Piece", animeId: "one-piece", liTitle: "Action" },
            { animeTitle: "Naruto Shippuden", animeId: "naruto-shippuden", liTitle: "Adventure" },
            { animeTitle: "Jujutsu Kaisen", animeId: "jujutsu-kaisen-2nd-season", liTitle: "Fantasy" },
            { animeTitle: "Bleach", animeId: "bleach", liTitle: "Shounen" }
        ]);
    }
});

app.get('/', (req, res) => res.send('Anime API Bridge is Running'));

module.exports = app;
