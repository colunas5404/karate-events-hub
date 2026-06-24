/**
 * Validador de dados - Verifica integridade dos eventos
 */

const fs = require('fs').promises;
const path = require('path');

const EVENTS_FILE = path.join(__dirname, '../data/events.json');

class EventValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validar evento individual
   */
  validateEvent(event) {
    const required = ['id', 'title', 'country', 'date', 'location'];
    
    for (const field of required) {
      if (!event[field]) {
        this.errors.push(`Evento ${event.id}: falta campo obrigatório '${field}'`);
        return false;
      }
    }

    // Validar data
    if (!event.date.start || isNaN(new Date(event.date.start).getTime())) {
      this.errors.push(`Evento ${event.id}: data inválida`);
      return false;
    }

    // Validar localização
    if (!event.location.city) {
      this.warnings.push(`Evento ${event.id}: cidade ausente`);
    }

    return true;
  }

  /**
   * Validar ficheiro de eventos
   */
  async validateFile() {
    try {
      console.log('🔍 Validando ficheiro de eventos...\n');

      const data = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'));

      if (!data.meta || !data.events) {
        throw new Error('Estrutura de ficheiro inválida');
      }

      console.log(`📊 Total de eventos: ${data.events.length}`);

      // Validar cada evento
      let valid = 0;
      data.events.forEach(event => {
        if (this.validateEvent(event)) {
          valid++;
        }
      });

      console.log(`✅ Eventos válidos: ${valid}/${data.events.length}`);

      if (this.warnings.length > 0) {
        console.log(`\n⚠️ Avisos (${this.warnings.length}):`);
        this.warnings.slice(0, 5).forEach(w => console.log(`  - ${w}`));
        if (this.warnings.length > 5) {
          console.log(`  ... e mais ${this.warnings.length - 5}`);
        }
      }

      if (this.errors.length > 0) {
        console.log(`\n❌ Erros (${this.errors.length}):`);
        this.errors.slice(0, 5).forEach(e => console.log(`  - ${e}`));
        if (this.errors.length > 5) {
          console.log(`  ... e mais ${this.errors.length - 5}`);
        }
        return false;
      }

      console.log('\n✅ Validação bem-sucedida!');
      return true;

    } catch (error) {
      console.error('❌ Erro ao validar:', error.message);
      return false;
    }
  }
}

// Executar
if (require.main === module) {
  const validator = new EventValidator();
  validator.validateFile().then(valid => {
    process.exit(valid ? 0 : 1);
  });
}

module.exports = { EventValidator };
