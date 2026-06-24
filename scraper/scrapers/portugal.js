/**
 * Scraper específico para FNK-P
 * URL: https://fnkp.pt/calendario/
 */
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePortugal() {
  const events = [];
  const year = new Date().getFullYear();

  for (let month = 1; month <= 12; month++) {
    try {
      const url = `https://fnkp.pt/calendario/?mes=${month}&ano=${year}`;
      const res = await axios.get(url, {
        timeout: 12000,
        headers: { 'User-Agent': 'Mozilla/5.0 Karate-Events-Hub/1.0' }
      });
      const $ = cheerio.load(res.data);

      // Tentar vários seletores possíveis do site FNK-P
      $('article, .evento, .event, [class*="evento"], [class*="calendar"]').each((_, el) => {
        const $el = $(el);
        const title = $el.find('h1,h2,h3,h4').first().text().trim() || $el.text().trim().substring(0,80);
        if (!title || title.length < 4) return;

        const dateMatch = $el.text().match(/(\d{1,2})(?:-(\d{1,2}))?/);
        const day = dateMatch ? parseInt(dateMatch[1]) : 1;
        const endDay = dateMatch?.[2] ? parseInt(dateMatch[2]) : day;

        events.push({
          id: `PT_FNK_${year}${String(month).padStart(2,'0')}${String(day).padStart(2,'0')}_${events.length+1}`,
          source: 'PT_FNK',
          title,
          country: 'Portugal',
          countryCode: 'PT',
          federation: 'Federação Nacional de Karaté - Portugal',
          date: {
            start: new Date(year, month-1, day, 9, 0).toISOString(),
            end: new Date(year, month-1, endDay, 18, 0).toISOString()
          },
          location: { city: 'Portugal', venue: 'A confirmar', address: '', coordinates: { latitude: 38.7223, longitude: -9.1393 } },
          categories: ['A confirmar'],
          level: /mundial|world|premier|intern/i.test($el.text()) ? 'international' : 'national',
          registrationUrl: 'https://www.fnkp.pt/calendario',
          metadata: { sourceUrl: url, scrapedAt: new Date().toISOString(), quality: 0.80 }
        });
      });
    } catch(e) { /* silenciar */ }
  }

  console.log(`  🇵🇹 FNK-P: ${events.length} eventos`);
  return events;
}

module.exports = { scrapePortugal };
