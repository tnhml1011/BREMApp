const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // 🔑 Firebase Admin SDK

// ✅ Khởi tạo Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const collection = db.collection('Information'); // 📁 Tên collection cho thông tin giới thiệu

const BASE_URL = 'https://moitruongbinhduong.gov.vn/';
const TARGET_PAGE = `${BASE_URL}gioi-thieu.html`;

async function crawlInformation() {
  try {
    const { data } = await axios.get(TARGET_PAGE);
    const $ = cheerio.load(data);

    $('.box_news.tinchia2.clearfix').each(async (i, el) => {
      const title = $(el).find('h3 a').attr('title')?.trim();
      const href = $(el).find('h3 a').attr('href')?.trim();
      const url = BASE_URL + href;
      const date = $(el).find('p.ngaytao').text().trim().match(/\d{2}\.\d{2}\.\d{4}/)?.[0];
      const views = parseInt($(el).find('p.ngaytao span').text().replace(/\D/g, '')) || 0;
      const description = $(el).find('.mota.catchuoi2').text().trim();

      // ✅ Lấy ảnh thumbnail
      let thumbnail = $(el).find('a img').attr('src')?.trim();
      if (thumbnail && !thumbnail.startsWith('http')) {
        thumbnail = BASE_URL + thumbnail.replace(/^\//, '');
      }

      // 🔎 Kiểm tra trùng lặp theo URL
      const snapshot = await collection.where('url', '==', url).get();
      if (!snapshot.empty) {
        console.log('⚠️ Bỏ qua (đã có):', title);
        return;
      }

      // ✅ Nếu chưa có thì lưu vào Firestore
      const infoData = {
        title,
        url,
        date,
        views,
        description,
        thumbnail,
        crawledAt: new Date()
      };

      await collection.add(infoData);
      console.log('✅ Đã lưu thông tin:', title);
    });
  } catch (error) {
    console.error('❌ Lỗi khi crawl thông tin:', error.message);
  }
}

crawlInformation();
