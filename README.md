# Karate Events Hub 🥋

Agregador global de provas, competições e eventos de karaté de todas as federações e associações da Europa e outras regiões do mundo.

## 🌍 Visão Geral

Uma plataforma web para descobrir, filtrar e acompanhar eventos de karaté em tempo real de mais de 31 federações nacionais europeia.

**Site ao vivo:** https://colunas5404.github.io/karate-events-hub/

## ✨ Features

- 📅 **Calendário interativo** com eventos de toda a Europa
- 🗺️ **Mapa visual** com localização dos eventos
- 🔍 **Filtros avançados** por país, data, nome da prova
- 📊 **Dados em tempo real** - atualização automática diária
- 🔗 **Dados estruturados** em JSON para fácil integração
- ♿ **Design responsivo** - funciona em desktop e mobile

## 📊 Cobertura

- **10+ países europeus** com calendários integrados
- **Atualizações diárias** automáticas via GitHub Actions
- **100+ eventos** catalogados
- **Dados validados** e estruturados

## 🚀 Como Começar

### Instalação Local

```bash
# Clonar repositório
git clone https://github.com/colunas5404/karate-events-hub.git
cd karate-events-hub

# Instalar dependências
npm install

# Correr scraper localmente
npm run scrape

# Validar dados
npm run validate

# Abrir página web
# Abra frontend/index.html num browser
```

## 🔧 Estrutura do Projeto

```
karate-events-hub/
├── frontend/
│   └── index.html           # Página web interativa
├── data/
│   ├── federations.json     # Configuração de federações
│   ├── events.json          # Dados de eventos (gerado)
│   └── archive/             # Backups históricos
├── scraper/
│   ├── index.js            # Scraper principal
│   └── utils/
│       └── validator.js    # Validador de dados
├── .github/
│   └── workflows/
│       └── scrape.yml      # GitHub Actions workflow
├── docs/
├── package.json
└── README.md
```

## 📋 Dados

### Formato de Evento

```json
{
  "id": "PT_FNK_20250315_001",
  "source": "PT_FNK",
  "title": "Campeonato Nacional Senior 2025",
  "country": "Portugal",
  "countryCode": "PT",
  "federation": "Federação Nacional de Karaté",
  "date": {
    "start": "2025-03-15T09:00:00+00:00",
    "end": "2025-03-15T18:00:00+00:00"
  },
  "location": {
    "city": "Lisboa",
    "venue": "Pavilhão João Rocha",
    "address": "Rua da Paz, 1000",
    "coordinates": {
      "latitude": 38.7223,
      "longitude": -9.1393
    }
  },
  "categories": ["M+18", "F+18"],
  "level": "national",
  "registrationUrl": "https://...",
  "metadata": {
    "sourceUrl": "https://...",
    "scrapedAt": "2025-01-15T10:30:00Z",
    "quality": 0.95
  }
}
```

## 🔄 Atualização Automática

O projeto utiliza **GitHub Actions** para:
- ✅ Correr o scraper **todos os dias às 06:00 UTC**
- ✅ Validar os dados
- ✅ Fazer commit automático se houver mudanças
- ✅ Deploy automático no GitHub Pages

Ver logs em: `.github/workflows/scrape.yml`

## 🛠️ Scripts Disponíveis

```bash
# Correr scraper
npm run scrape

# Validar dados
npm run validate

# Executar testes
npm run test

# Build para GitHub Pages
npm run build:pages
```

## 🤝 Como Contribuir

### Adicionar uma Nova Federação

1. Editar `data/federations.json` e adicionar:

```json
{
  "id": "XX_FEDERATION",
  "country": "País",
  "countryCode": "XX",
  "name": "Nome da Federação",
  "website": "https://...",
  "calendarUrl": "https://...",
  "type": "national",
  "wkfAffiliation": true,
  "language": "xx",
  "timezone": "Europe/Capital",
  "status": "active"
}
```

2. Criar scraper específico em `scraper/scrapers/` se necessário
3. Testar: `npm run scrape`
4. Fazer PR com as mudanças

### Reportar Problemas

- Criar issue no GitHub com detalhes
- Incluir screenshots se aplicável
- Sugerir soluções se possível

## 📈 Roadmap

- [ ] Cobertura completa de 31+ países europeus
- [ ] Expansão para CAC (América), EKF (Ásia)
- [ ] API REST pública
- [ ] Contribuições comunitárias (RFC process)
- [ ] Aplicação móvel (PWA)
- [ ] Notificações por email/SMS
- [ ] Histórico de eventos
- [ ] Estatísticas e analytics

## 🔗 Parceiros

- WKF - World Karate Federation
- Federações Nacionais de Karaté
- Associações Locais de Karaté

## 📝 Licença

MIT License - veja [LICENSE](LICENSE)

## 👨‍💼 Contacto

- GitHub Issues: [Criar Issue](https://github.com/colunas5404/karate-events-hub/issues)
- Email: rui.belo@grincop.pt

---

**Desenvolvido com ❤️ para a comunidade de karaté**

Last updated: 2025-01-15
