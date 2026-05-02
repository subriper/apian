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
        // استفاده از ای‌پی‌آی قدرتمند Jikan که مسدود نمی‌شود
        const response = await axios.get(`https://api.jikan.moe/v4/top/anime`, {
            params: {
                page: page,
                limit: 20
            }
        });

        const results = response.data.data || [];

        // تبدیل به فرمتی که در پیام قبلی فرستادی
        const animeList = results.map(anime => ({
            animeTitle: anime.title_english || anime.title,
            animeId: anime.mal_id, // آیدی عددی (پایدارترین حالت)
            liTitle: anime.genres.length > 0 ? anime.genres[0].name : "Anime"
        }));

        res.json(animeList);

    } catch (error) {
        // دیتای تستی فقط برای زمانی که اینترنت سرور قطع باشد
        res.json([
            { animeTitle: "One Piece", animeId: "one-piece", liTitle: "Action" },
            { animeTitle: "Naruto Shippuden", animeId: "naruto-shippuden", liTitle: "Adventure" },
            { animeTitle: "Jujutsu Kaisen", animeId: "jujutsu-kaisen", liTitle: "Fantasy" }
        ]);
    }
});

app.get('/', (req, res) => res.send('Anime Bridge is Active'));

module.exports = app;
