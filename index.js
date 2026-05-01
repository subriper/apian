const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// رفع مشکل Cors برای اتصال فرانت‌اند
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// مسیر اصلی برای گرفتن انیمه‌های جدید
app.get('/api/recent', async (req, res) => {
    try {
        // گرفتن سورس سایت Animekai
        const { data } = await axios.get('https://animekai.to/');
        const $ = cheerio.load(data);
        let animeList = [];

        // نکته: کلاس‌های '.item' و '.name' فقط مثال هستن
        // باید Inspect Element بگیری و کلاس‌های دقیق سایت Animekai رو اینجا جایگزین کنی
        $('.items .item').each((i, el) => {
            animeList.push({
                title: $(el).find('.name').text().trim(),
                link: $(el).find('a').attr('href'),
                image: $(el).find('img').attr('src')
            });
        });

        // خروجی تمیز Json
        res.json({ success: true, data: animeList });
    } catch (error) {
        res.status(500).json({ success: false, message: 'خطا در ارتباط با سرور Animekai' });
    }
});

module.exports = app;