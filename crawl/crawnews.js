import axios from 'axios';
import cheerio from 'cheerio';

async function crawlNews() {
  const url = 'https://moitruongbinhduong.gov.vn/tin-tuc.html';
  
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  const items = [];
  $('.box_news.tinchia2.clearfix.item-pt').each((i, el) => {
    const el$ = $(el);
    const link = el$.find('a').first().attr('href');
    const title = el$.find('h3 a').text().trim();
    const date = el$.find('p.ngaytao').text().trim();
    const desc = el$.find('.mota.catchuoi2').text().trim();
    const fullLink = new URL(link, url).href;

    items.push({ title, date, desc, link: fullLink });
  });

  return items;
}

crawlNews().then(items => {
  console.log(items);
}).catch(console.error);
