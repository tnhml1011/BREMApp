const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // 🔑 Tệp JSON Firebase Admin SDK

// ✅ Khởi tạo Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const collection = db.collection('news'); // 🔥 Tên collection bạn dùng

const BASE_URL = 'https://moitruongbinhduong.gov.vn/';

async function crawlNews() {
  try {
    const { data } = await axios.get(`${BASE_URL}tin-tuc.html`);
    const $ = cheerio.load(data);

    $('.box_news.tinchia2.clearfix.item-pt').each(async (i, el) => {
      const title = $(el).find('h3 a').attr('title')?.trim();
      const relativeUrl = $(el).find('h3 a').attr('href')?.trim();
      const url = BASE_URL + relativeUrl;

      const date = $(el).find('p.ngaytao').text().trim().split('\n')[0].match(/\d{2}\.\d{2}\.\d{4}/)?.[0];
      const views = parseInt($(el).find('p.ngaytao span').text().replace(/\D/g, '')) || 0;
      const description = $(el).find('.mota.catchuoi2').text().trim();

      let thumbnail = $(el).find('a img').attr('src');
      if (thumbnail && !thumbnail.startsWith('http')) {
        thumbnail = BASE_URL + thumbnail.replace(/^\//, '');
      }

      const newsData = {
        title,
        url,
        date,
        views,
        description,
        thumbnail,
        crawledAt: new Date()
      };

      // 🔎 Kiểm tra trùng lặp theo `url`
      const snapshot = await collection.where('url', '==', url).get();
      if (!snapshot.empty) {
        console.log('⚠️ Bỏ qua (đã có):', title);
        return;
      }

      // ✅ Lưu nếu chưa có
      await collection.add(newsData);
      console.log('✅ Đã lưu:', title);
    });
  } catch (error) {
    console.error('❌ Lỗi khi crawl:', error);
  }
}

crawlNews();
