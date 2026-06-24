#!/usr/bin/env node

/**
 * Karate Events Hub - Main Scraper
 * Coleta eventos de provas de karaté das federações europeia
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const FEDERATIONS_FILE = path.join(__dirname, '../data/federations.json');
const OUTPUT_FILE = path.join(__dirname, '../data/events.json');

class KarateScraper {
  constructor() {
    this.client = axios.create({
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Karate-Events-Hub/1.0'
      }
    });
    this.events = [];
    this.errors = [];
  }

  /**
   * Fetch com retry automático
   */
  async fetchWithRetry(url, retries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.client.get(url);
        if (response.status === 200) {
          return response.data;
        }
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          const delay = 1000 * Math.pow(2, attempt - 1);
          console.log(`  ⏳ Tentativa ${attempt}/${retries} falhou, aguardando ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('Fetch falhou após tentativas');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Criar evento normalizado
   */
  createEvent(data) {
    return {
      id: `${data.source}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source: data.source,
      title: (data.title || '').trim(),
      country: data.country,
      countryCode: data.countryCode,
      federation: data.federation,
      date: {
        start: data.startDate,
        end: data.endDate || null
      },
      location: {
        city: (data.city || '').trim(),
        venue: (data.venue || 'TBD').trim(),
        address: (data.address || '').trim(),
        coordinates: data.coordinates || null
      },
      categories: data.categories || ['Mixed'],
      level: data.level || 'national',
      registrationUrl: data.registrationUrl || null,
      metadata: {
        sourceUrl: data.sourceUrl,
        scrapedAt: new Date().toISOString(),
        quality: data.quality || 0.8
      }
    };
  }

  /**
   * Extrair categorias de texto
   */
  extractCategories(text) {
    const categoryPatterns = {
      'Infantil': /infantil|U10|sub-10/i,
      'Cadete': /cadete|U14|sub-14/i,
      'Junior': /junior|U21|sub-21/i,
      'Senior': /senior|adulto|+21|open/i,
      'Master': /master|veterano|+40/i
    };

    const categories = [];
    for (const [category, pattern] of Object.entries(categoryPatterns)) {
      if (pattern.test(text)) {
        categories.push(category);
      }
    }

    return categories.length > 0 ? categories : ['Mixed'];
  }

  /**
   * Parse de datas em vários formatos
   */
  parseDate(dateString) {
    if (!dateString) return null;

    const patterns = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{2})?/,
      /(\d{1,2})-(\d{1,2})-(\d{4})/,
      /(\d{4})-(\d{1,2})-(\d{1,2})/
    ];

    for (const pattern of patterns) {
      const match = dateString.match(pattern);
      if (match) {
        let [, day, month, year, hour, minute] = match;
        hour = hour || '09';
        minute = minute || '00';

        try {
          const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
          );

          if (!isNaN(date.getTime())) {
            return date.toISOString();
          }
        } catch (e) {
          console.warn(`  ⚠️ Erro ao parsear data: ${dateString}`);
        }
      }
    }

    return null;
  }

  /**
   * Scraper genérico (fallback)
   */
  async scrapeGeneric(federation) {
    const events = [];

    try {
      console.log(`\n🌐 Scraping genérico: ${federation.name}`);
      const html = await this.fetchWithRetry(federation.calendarUrl);
      const $ = cheerio.load(html);

      // Procurar padrões comuns
      const eventSelectors = [
        '[data-event]',
        '.event',
        '.competition',
        '[class*="event"]',
        '[class*="competition"]',
        'article'
      ];

      let found = false;
      for (const selector of eventSelectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          console.log(`  📍 Encontrados ${elements.length} elementos com seletor: ${selector}`);

          elements.each((_, el) => {
            const $el = $(el);
            const text = $el.text();

            // Filtrar elementos com conteúdo relevante
            if (text.length > 10 && (text.includes('2025') || text.includes('karate') || text.includes('championship'))) {
              const eventData = {
                source: federation.id,
                country: federation.country,
                countryCode: federation.countryCode,
                federation: federation.name,
                title: $el.find('h1, h2, h3, .title, [class*="title"]').text() || text.substring(0, 100),
                city: $el.find('[class*="city"], [class*="location"]').text() || federation.country,
                venue: 'TBD',
                startDate: this.parseDate(text),
                categories: this.extractCategories(text),
                registrationUrl: $el.find('a[href*="inscri"], a[href*="regis"]').attr('href'),
                sourceUrl: federation.calendarUrl,
                level: 'national',
                quality: 0.6
              };

              if (eventData.title && eventData.startDate) {
                events.push(this.createEvent(eventData));
                found = true;
              }
            }
          });

          if (found) break;
        }
      }

      console.log(`  ✅ ${events.length} eventos encontrados`);
      return events;

    } catch (error) {
      console.error(`  ❌ Erro ao scraping ${federation.id}: ${error.message}`);
      this.errors.push({
        federation: federation.id,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return [];
    }
  }

  /**
   * Executar todos os scrapers
   */
  async runAll() {
    try {
      const federationsRaw = await fs.readFile(FEDERATIONS_FILE, 'utf8');
      const federationsConfig = JSON.parse(federationsRaw).federations;

      console.log('\n🚀 Iniciando Karate Events Hub Scraper');
      console.log(`📋 ${federationsConfig.length} federações a processar\n`);

      for (const federation of federationsConfig) {
        try {
          const events = await this.scrapeGeneric(federation);
          this.events.push(...events);
        } catch (error) {
          console.error(`  🔴 Erro crítico em ${federation.id}: ${error.message}`);
        }
      }

      // Deduplicar
      const unique = this.deduplicateEvents(this.events);

      // Ordenar por data
      unique.sort((a, b) => 
        new Date(a.date.start) - new Date(b.date.start)
      );

      // Criar output
      const output = {
        meta: {
          version: '1.0',
          lastUpdated: new Date().toISOString(),
          totalEvents: unique.length,
          countryCoverage: new Set(unique.map(e => e.countryCode)).size,
          generatedBy: 'Karate Events Hub Scraper v1.0',
          errors: this.errors.length > 0 ? this.errors : undefined
        },
        events: unique
      };

      // Salvar
      await fs.writeFile(
        OUTPUT_FILE,
        JSON.stringify(output, null, 2),
        'utf8'
      );

      this.printSummary(output);
      return output;

    } catch (error) {
      console.error('🔴 Erro crítico:', error);
      process.exit(1);
    }
  }

  /**
   * Deduplicar eventos
   */
  deduplicateEvents(events) {
    const seen = new Set();
    return events.filter(event => {
      const key = `${event.title}|${event.date.start}|${event.location.city}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Imprimir sumário
   */
  printSummary(data) {
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO FINAL');
    console.log('='.repeat(50));
    console.log(`Total de eventos: ${data.meta.totalEvents}`);
    console.log(`Países cobertos: ${data.meta.countryCoverage}`);
    console.log(`Erros encontrados: ${data.meta.errors?.length || 0}`);
    
    if (data.meta.errors && data.meta.errors.length > 0) {
      console.log('\n⚠️ Erros:');
      data.meta.errors.forEach(e => {
        console.log(`  - ${e.federation}: ${e.error}`);
      });
    }

    const eventsByCountry = {};
    data.events.forEach(event => {
      eventsByCountry[event.country] = (eventsByCountry[event.country] || 0) + 1;
    });

    console.log('\n📍 Eventos por país:');
    Object.entries(eventsByCountry)
      .sort((a, b) => b[1] - a[1])
      .forEach(([country, count]) => {
        console.log(`  ${country}: ${count}`);
      });

    console.log(`\n✅ Dados salvos em: ${OUTPUT_FILE}`);
    console.log('='.repeat(50) + '\n');
  }
}

// Executar
if (require.main === module) {
  const scraper = new KarateScraper();
  scraper.runAll().catch(console.error);
}

module.exports = { KarateScraper };
