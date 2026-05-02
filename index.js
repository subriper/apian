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
        
        const options = {
            method: 'GET',
            // تغییر به یک Endpoint عمومی‌تر که معمولا در تمام پلن‌ها فعال است
            url: 'https://gogoanime2.p.rapidapi.com/recent-release', 
            params: { page: page, type: '1' },
            headers: {
                'x-rapidapi-key': '748d416499mshbb161b48db61a5dp1eb23cjsn80a9f87dbc23',
                'x-rapidapi-host': 'gogoanime2.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // RapidAPI ممکن است دیتا را مستقیما یا در فیلد results بفرستد
        const results = Array.isArray(response.data) ? response.data : (response.data.results || []);

        if (results.length === 0) {
            return res.json([{ animeTitle: "No Data Found in RapidAPI", animeId: "#", liTitle: "" }]);
        }

        const animeList = results.map(anime => ({
            animeTitle: anime.animeTitle || anime.title || "Unknown Title",
            animeId: anime.animeId || anime.id || "#",
            liTitle: anime.episodeNum ? `Episode ${anime.episodeNum}` : ""
        }));

        res.json(animeList);

    } catch (error) {
        // نمایش نوع خطا برای عیب‌یابی دقیق‌تر
        const errorMsg = error.response ? `API Error: ${error.response.status}` : "Network Error";
        res.status(500).json([{ 
            animeTitle: errorMsg, 
            animeId: "#", 
            liTitle: "Check RapidAPI Subscription" 
        }]);
    }
});

app.get('/', (req, res) => res.send('Bridge is running'));

module.exports = app;
