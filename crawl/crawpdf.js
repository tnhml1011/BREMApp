const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const BASE_URL = 'https://moitruongbinhduong.gov.vn/';

function parseVietnameseDate(dateStr) {
  const parts = dateStr.trim().match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!parts) return null;
  const [_, day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}

async function isPdfLinkExists(pdfLink) {
  const snapshot = await db
    .collection('introdure')
    .where('pdf_link', '==', pdfLink)
    .limit(1)
    .get();
  return !snapshot.empty;
}

async function crawlAndSave() {
  try {
    const { data } = await axios.get(`${BASE_URL}tai-lieu-tu-lieu.html`);
    const $ = cheerio.load(data);
    const items = $('.box_news.tinchia2');

    for (let i = 0; i < items.length; i++) {
      const el = items.eq(i);
      const title = el.find('h3 a').text().trim();
      const dateRaw = el.find('.ngaytao').text().trim();
      const dateMatch = dateRaw.match(/\d{2}\.\d{2}\.\d{4}/);
      const createdAt = dateMatch ? parseVietnameseDate(dateMatch[0]) : new Date();
      const thumbnail = BASE_URL + el.find('img').attr('src');
      const detailPath = el.find('h3 a').attr('href');
      const detailLink = BASE_URL + detailPath;

      const detailRes = await axios.get(detailLink);
      const _$ = cheerio.load(detailRes.data);
      const pdfHref = _$('a.icon-download').attr('href');
      const pdfLink = pdfHref ? (pdfHref.startsWith('http') ? pdfHref : BASE_URL + pdfHref) : '';

      if (!pdfLink) {
        console.log(`❌ Không tìm thấy PDF cho: ${title}`);
        continue;
      }

      const exists = await isPdfLinkExists(pdfLink);
      if (exists) {
        console.log(`⚠️ Đã tồn tại trong CSDL: ${title}`);
        continue;
      }

      await db.collection('introdure').add({
        title,
        created_at: admin.firestore.Timestamp.fromDate(createdAt),
        thumbnail,
        detail_link: detailLink,
        pdf_link: pdfLink,
      });

      console.log(`✅ Đã lưu: ${title}`);
    }

    console.log('🎉 Crawl hoàn tất!');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  }
}

crawlAndSave();
