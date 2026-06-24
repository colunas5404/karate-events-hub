# 🚀 Como Fazer Push para GitHub

O projeto está pronto! Seguir estes passos para fazer upload para o teu GitHub:

## Passo 1: Download do Projeto

1. Download o ficheiro `karate-events-hub-complete.zip`
2. Extrair em qualquer localização no teu computador
3. Abrir terminal/PowerShell nessa pasta

## Passo 2: Verificar o Token

⚠️ **IMPORTANTE**: O token pode ter expirado ou ter um problema.

Gerar um novo token no GitHub:

1. Ir a: https://github.com/settings/tokens/new
2. Clica em "Generate new token (classic)"
3. Preenche:
   - **Note**: `Karate Events Hub`
   - **Expiration**: `90 days` ou `Unlimited`
4. **Seleciona estes scopes:**
   - ✅ `repo` (acesso completo)
   - ✅ `workflow` (GitHub Actions)
   - ✅ `admin:repo_hook`
5. Clica "Generate token"
6. **Copia o token inteiro** (aparece uma só vez!)

## Passo 3: Criar Repositório no GitHub

1. Vai a: https://github.com/new
2. Preenche:
   - **Repository name**: `karate-events-hub`
   - **Description**: `Global calendar aggregator for karate events`
   - **Visibility**: `Public`
3. **NÃO** seleciona "Add a README file" (já temos)
4. **NÃO** seleciona ".gitignore" (já temos)
5. Clica "Create repository"

## Passo 4: Configurar e Fazer Push

No terminal, dentro da pasta do projeto:

```bash
# Se ainda não está inicializado como git:
git init
git config user.email "seu-email@gmail.com"
git config user.name "colunas5404"

# Adicionar remote
git remote add origin https://github.com/colunas5404/karate-events-hub.git

# Renomear branch
git branch -M main

# Fazer push (vai pedir credenciais)
git push -u origin main
```

Quando pedir username/password:
- **Username**: `colunas5404`
- **Password**: [Colar o token aqui - não a senha do GitHub!]

## Passo 5: Ativar GitHub Pages

Após o push:

1. Ir ao repositório no GitHub
2. **Settings** → **Pages**
3. **Source**: Selecionar `main` branch
4. **Folder**: Selecionar `/ (root)`
5. Clicar "Save"

A página ficará disponível em: **https://colunas5404.github.io/karate-events-hub/**

## Passo 6: Ativar GitHub Actions

1. Ir ao repositório → **Actions**
2. Ver o workflow `Daily Scrape Events`
3. Se desativado, clicar "Enable workflow"

Agora o scraper vai correr **automaticamente todos os dias às 06:00 UTC**!

---

## ✅ Pronto!

O projeto está completo com:
- ✅ Página web interativa (frontend)
- ✅ Scraper automático (backend)
- ✅ GitHub Actions (atualização diária)
- ✅ Dados de exemplo (10+ eventos)
- ✅ Dados de 10 federações

Podes:
- 🔄 Adicionar mais federações em `data/federations.json`
- 🎨 Personalizar o design em `frontend/index.html`
- 🛠️ Melhorar o scraper em `scraper/index.js`
- 📝 Contactar federações para parceria

---

## 📞 Se Houver Problemas

### "fatal: could not read Password"
- Usar token de acesso pessoal, não a senha do GitHub
- Gerar um novo token se necessário

### "repository not found"
- Verificar se o repositório foi criado em github.com/new
- Verificar o username está correto (colunas5404)

### Token expirado
- Ir a https://github.com/settings/tokens
- Gerar um novo token
- Fazer push novamente

---

**Boa sorte! 🚀**
