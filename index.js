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
        // تغییر سورس به یک دامنه فعال دیگر برای دور زدن محدودیت
        const targetUrl = `https://www.enma.lol/subbed-anime?page=${page}`;
        
        const { data } = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            },
            timeout: 10000 // ۱۰ ثانیه صبر برای پاسخ
        });
        
        const $ = cheerio.load(data);
        let animeList = [];

        // تست دو مدل کلاس مختلف که سایت‌های انیمه استفاده می‌کنند
        const selectors = ['.listing li a', '.anime_list_body ul li a', '.items li a'];
        
        selectors.forEach(selector => {
            if (animeList.length === 0) {
                $(selector).each((i, el) => {
                    const title = $(el).text().trim();
                    const href = $(el).attr('href') || "";
                    
                    if (title && href) {
                        animeList.push({
                            animeTitle: title,
                            animeId: href.replace('/category/', '').replace('https://gogoanime.uk.com', ''),
                            liTitle: title
                        });
                    }
                });
            }
        });

        res.json(animeList);
    } catch (error) {
        // اگر کلا مسدود بود، حداقل یک آیتم تستی برگردان تا سایت خالی نماند
        res.json([
            { animeTitle: "API Connection Timeout - Please Refresh", animeId: "#", liTitle: "" }
        ]);
    }
});

app.get('/', (req, res) => res.send('API is Online'));

module.exports = app;
