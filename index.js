const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/animeList', async (req, res) => {
    const page = req.query.page || 1;
    const apiKey = '748d416499mshbb161b48db61a5dp1eb23cjsn80a9f87dbc23';
    const apiHost = 'gogoanime2.p.rapidapi.com';

    // لیست اولویت‌بندی شده مسیرها (اگر اولی 502 داد، دومی را تست می‌کند)
    const endpoints = [
        `https://${apiHost}/top-airing`,
        `https://${apiHost}/recent-release`,
        `https://${apiHost}/popular`
    ];

    for (let url of endpoints) {
        try {
            const response = await axios.get(url, {
                params: { page: page },
                headers: {
                    'x-rapidapi-key': apiKey,
                    'x-rapidapi-host': apiHost
                },
                timeout: 5000 // ۵ ثانیه صبر برای هر سرویس
            });

            const results = Array.isArray(response.data) ? response.data : (response.data.results || []);

            if (results.length > 0) {
                const animeList = results.map(anime => ({
                    animeTitle: anime.animeTitle || anime.title || "Unknown",
                    animeId: anime.animeId || anime.id || "#",
                    liTitle: anime.latestEp || (anime.episodeNum ? `Episode ${anime.episodeNum}` : "Anime")
                }));
                return res.json(animeList);
            }
        } catch (error) {
            console.log(`Failed to fetch from ${url}: ${error.message}`);
            continue; // برو سراغ مسیر بعدی
        }
    }

    // اگر تمام مسیرها با شکست مواجه شدند (دیتای تستی برای اینکه سایت خالی نماند)
    res.json([
        { animeTitle: "One Piece", animeId: "one-piece", liTitle: "Popular" },
        { animeTitle: "Naruto Shippuden", animeId: "naruto-shippuden", liTitle: "Classic" },
        { animeTitle: "Service Maintenance", animeId: "#", liTitle: "Try again later" }
    ]);
});

app.get('/', (req, res) => res.send('API Bridge is working'));

module.exports = app;
