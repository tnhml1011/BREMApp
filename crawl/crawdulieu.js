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
  if (!parts) return new Date();
  const [_, day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}

async function isPdfLinkExists(pdfLink) {
  const snapshot = await db
    .collection('dulieuquantrac')
    .where('pdf_link', '==', pdfLink)
    .limit(1)
    .get();
  return !snapshot.empty;
}

async function crawlPage(page) {
  const url =
    page === 1
      ? `${BASE_URL}du-lieu-quan-trac.html`
      : `${BASE_URL}du-lieu-quan-trac.html&p=${page}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const items = $('.box_news.tinchia2');

    if (items.length === 0) return false; // Không còn dữ liệu

    for (let i = 0; i < items.length; i++) {
      try {
        const el = items.eq(i);
        const title = el.find('h3 a').text().trim();
        const dateRaw = el.find('.ngaytao').text().trim();
        const dateMatch = dateRaw.match(/\d{2}\.\d{2}\.\d{4}/);
        const createdAt = dateMatch
          ? parseVietnameseDate(dateMatch[0])
          : new Date();
        const thumbnail = BASE_URL + el.find('img').attr('src');
        const detailPath = el.find('h3 a').attr('href');
        const detailLink = BASE_URL + detailPath;

        const detailRes = await axios.get(detailLink);
        const _$ = cheerio.load(detailRes.data);
        const pdfHref = _$('a.icon-download').attr('href');
        const pdfLink = pdfHref
          ? pdfHref.startsWith('http')
            ? pdfHref
            : BASE_URL + pdfHref
          : '';

        if (!pdfLink) {
          console.log(`❌ Không tìm thấy PDF cho: ${title}`);
          continue;
        }

        const exists = await isPdfLinkExists(pdfLink);
        if (exists) {
          console.log(`⚠️ Đã tồn tại trong CSDL: ${title}`);
          continue;
        }

        await db.collection('dulieuquantrac').add({
          title,
          created_at: admin.firestore.Timestamp.fromDate(createdAt),
          thumbnail,
          detail_link: detailLink,
          pdf_link: pdfLink,
        });

        console.log(`✅ Đã lưu: ${title}`);
      } catch (err) {
        console.error(`🚫 Lỗi khi xử lý bài ${i + 1} trang ${page}:`, err.message);
        continue;
      }
    }

    return true;
  } catch (pageErr) {
    console.error(`❌ Lỗi tải trang ${page}:`, pageErr.message);
    return false;
  }
}

async function crawlAllPages() {
  let page = 1;
  while (true) {
    console.log(`\n📄 Đang xử lý trang ${page}...`);
    const hasMore = await crawlPage(page);
    if (!hasMore) {
      console.log('\n✅ Đã hoàn tất toàn bộ trang!');
      break;
    }
    page++;
  }
}

crawlAllPages();
