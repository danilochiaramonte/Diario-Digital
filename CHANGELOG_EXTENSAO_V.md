# Changelog — Extensão V (Diário Digital)

Documento vivo para registrar alterações técnicas da Extensão V/VI (TCC UniFil — ADS).  
Serve como matéria-prima do relatório de extensão: cada fase deve descrever **contexto**, **o que mudou**, **como validar** e **pendências**.

---

## [Unreleased]

_Melhorias futuras (Extensão VI / TCC): ícones PWA em PNG, back-end opcional, testes automatizados._

---

## Fase 7 — Menu de Perfil e Segurança

### Hash de senha (Web Crypto API)

Senhas agora são armazenadas como hash SHA-256 usando a API nativa
`crypto.subtle.digest` (sem dependência externa). Usuários cadastrados
antes desta versão continuam funcionando — a senha em texto plano
ainda é aceita no login, mas é migrada para hash automaticamente
após autenticação bem-sucedida. Hashes são prefixados com `sha256:`
para distinguir de senhas legacy.

### Seletor de cores nas notas

Implementada paleta de 7 cores no editor de notas, conforme protótipo
da Extensão II. A cor escolhida é aplicada na borda lateral do card
na tela inicial, facilitando a categorização visual.

### Campo `createdAt` em User

Adicionado registro da data de cadastro de cada usuário, usado na
tela de perfil ("Membro desde...").

### Tela de Perfil do Usuário

Nova tela acessível pelo avatar no canto superior direito, contendo:

- Informações da conta (nome de usuário e data de cadastro)
- Estatísticas pessoais (total de notas, categoria mais usada,
  última edição)
- Troca de senha com validação de senha atual
- Exportar e Importar JSON (movidos da home para organização)
- Botão de logout
- Zona de perigo: exclusão de conta com confirmação tripla
  (confirm + senha + palavra-chave "EXCLUIR")

### UX

- Botão "Sair" vermelho do header substituído por avatar do usuário
  com inicial e nome, mais discreto e profissional.
- Home limpa: botões de export/import movidos para o perfil.

---

## Fase 5 — Higiene de código (2026-05-29)

### Alterações

- Removido usuário de teste `teste` / `senha123` do `UserManager`.
- Removidos `console.log` de sucesso/erro nas classes de domínio (feedback fica na UI).
- Excluído `src/App.css` (boilerplate Vite não utilizado).
- Criado `eslint.config.js`; comando `npm run lint` funcional.
- Removida chamada duplicada a `localStorage.removeItem` no logout (`StorageManager` já trata a sessão).
- Versão do pacote: **1.0.0**.

### Como validar

```bash
npm run lint
npm run build
```

---

## Fase 6 — Fechamento para entrega (2026-05-29)

### Alterações

| Artefato | Descrição |
|----------|-----------|
| `README.md` | Visão geral, scripts, links da documentação |
| `implementation_summary.md` | Resumo técnico atualizado (Extensão V) |
| `ROTEIRO_VIDEO_EXTENSAO_V.md` | Roteiro do vídeo de demonstração (~10 min) |
| `functional_tests.md` / `TESTING_CHECKLIST.md` | Conclusão e passos de entrega atualizados |
| `CHANGELOG_EXTENSAO_V.md` | Consolidação de todas as fases |

### Checklist de entrega

- [ ] Repositório no GitHub com workflow de Pages ativo
- [ ] URL pública funcionando
- [ ] `TESTING_CHECKLIST.md` executado manualmente
- [ ] Vídeo gravado conforme roteiro
- [ ] Relatório escrito a partir deste changelog

---

## Melhoria — Palavras-chave da sugestão de categoria (2026-05-29)

### Alterações

- Ampliada a lista de termos em `NoteManager.suggestCategory()` (compras, finanças, trabalho, urgente, estudos, saúde, pessoal).
- Novas categorias: **Finanças** e **Saúde**.
- Comparação continua sem acentos; vence a categoria com mais palavras encontradas no texto.

### Exemplos

| Texto | Categoria esperada |
|-------|-------------------|
| *Pagar o boleto do aluguel no pix* | Finanças |
| *Consulta com o dentista quinta* | Saúde |
| *Pedir marmita no ifood* | Compras |

---

## Fase 4 — PWA (Progressive Web App) (2026-05-29)

### Contexto

O app já era offline-first via `localStorage`, mas dependia de rede no primeiro carregamento. A Fase 4 adiciona **service worker** e **manifest** para cache dos arquivos estáticos e instalação na tela inicial do celular/desktop.

### Alterações realizadas

| Item | Descrição |
|------|-----------|
| `vite-plugin-pwa` | Gera service worker (Workbox) e `manifest.webmanifest` no build |
| `src/main.jsx` | Registro do SW com `registerSW({ immediate: true })` |
| `index.html` | Meta `theme-color` e tags Apple para “adicionar à tela inicial” |
| `vite.config.js` | Manifest (nome, cores, ícones) + `navigateFallback` para SPA no GitHub Pages |
| Tela Sobre | Menção à instalação PWA |

### Como validar

1. `npm run build` && `npm run preview`
2. DevTools → **Application** → Manifest (deve listar “Diário Digital”) e Service Workers (ativo).
3. Chrome: ícone de instalação na barra de endereço (ou menu “Instalar app”).
4. Com rede desligada **após** um acesso online, o shell do app deve abrir (dados das notas seguem no `localStorage`).

### Pendências / riscos

- Ícones atuais usam `vite.svg`; para lojas/ iOS ideal ter PNG 192×512 dedicados — Fase 6 ou refinamento visual.
- Service worker não sincroniza dados entre dispositivos (sem back-end).

---

## Fase 3 — UI alinhada aos testes documentados (2026-05-29)

### Contexto

Os relatórios da 5ª entrega (`functional_tests.md`, `TESTING_CHECKLIST.md`) descreviam validações, mensagens e botões que não estavam refletidos na interface React (apenas `alert()` ou campos ausentes).

### Alterações realizadas

| Requisito (documentação) | Implementação |
|--------------------------|---------------|
| Confirmar senha no cadastro | Campo “Confirmar senha” + validação |
| Campos vazios (login/cadastro) | Mensagem: “Por favor, preencha todos os campos.” |
| Senhas diferentes | “As senhas não coincidem.” |
| Senha curta (&lt; 4) | Validação com mensagem explícita |
| Usuário duplicado | “Nome de usuário já existe.” |
| Login inválido | “Nome de usuário ou senha inválidos.” |
| Título/conteúdo vazios na nota | “Título e conteúdo não podem ser vazios.” |
| Botão “Sugerir Categoria” | Integrado com `StorageManager.suggestCategory()` |
| Busca sem resultados | “Nenhuma nota encontrada para '…'.” |
| Lista vazia | “Nenhuma nota ainda…” |
| Exclusão | Confirmação: “Tem certeza que deseja excluir esta nota?” |
| Feedback visual | Componente `FormMessage` (erro vermelho / sucesso verde) |
| Categoria “Compras” na IA | Ajuste em `NoteManager.suggestCategory()` |

**Áudio:** mantido reconhecimento de voz nativo (Web Speech API); erros exibidos na tela em vez de `alert`.

### Arquivos modificados

- `src/App.jsx` — validações, mensagens inline, busca, sugestão de categoria
- `src/logic/NoteManager.js` — categoria “Compras” para palavras-chave de compras/mercado
- `CHANGELOG_EXTENSAO_V.md`

### Como validar

Seguir cenários TU-001 a TU-011 e TA-001 a TA-011 de `functional_tests.md` / `TESTING_CHECKLIST.md` no `npm run dev`.

### Pendências / riscos

- Usuário de teste `teste`/`senha123` no `UserManager` — Fase 5.
- PWA e service worker — Fase 4.

---

## Fase 2 — GitHub Pages e confirmação de cadastro (2026-05-29)

### Contexto

A Fase 1 preparou o build com `base: '/Diario-Digital/'`, mas ainda faltava automação de publicação. Paralelamente, o cadastro usava `alert()` nativo, com feedback pouco visível na interface.

### Alterações realizadas

| Área | Descrição |
|------|-----------|
| **GitHub Actions** | Workflow `deploy.yml`: build em push na `main` + publicação via GitHub Pages |
| **`.gitignore`** | Ignora `node_modules/`, `dist/`, arquivos locais |
| **`DEPLOYMENT.md`** | Seção GitHub Pages com URL esperada e passo a passo em Settings |
| **Cadastro (UX)** | Tela de sucesso com ícone, mensagem personalizada com o usuário criado e botão “Ir para o login” (pré-preenche o usuário no login) |
| **Erro de cadastro** | Mensagem inline vermelha em vez de `alert` quando o usuário já existe |

### Arquivos modificados / criados

- `.github/workflows/deploy.yml` (novo)
- `.gitignore` (novo)
- `DEPLOYMENT.md`
- `src/App.jsx`
- `CHANGELOG_EXTENSAO_V.md`

### Como validar

**Cadastro:**

1. Abra Cadastro, crie um usuário novo.
2. Deve aparecer a tela “Cadastro concluído!” com o nome do usuário.
3. Clique em “Ir para o login” → campo usuário já preenchido.

**Build e Pages (após commit + push na `main`):**

1. GitHub → Settings → Pages → Source: **GitHub Actions**
2. Aguarde o workflow “Deploy GitHub Pages” concluir (verde).
3. Acesse `https://<usuario>.github.io/Diario-Digital/`

### Pendências / riscos

- O site só fica no ar após **push** do workflow e configuração de Pages no repositório remoto.
- Usuário de teste `teste`/`senha123` ainda é criado no `UserManager` — Fase 5.
- Confirmar senha no cadastro — Fase 3.

---

## Fase 1 — Saneamento do build (2026-05-29)

### Contexto

O projeto acumulava **duas fontes de estilo Tailwind** ao mesmo tempo:

1. **CDN** (`https://cdn.tailwindcss.com`) no `index.html`, carregada em dev e copiada para o build.
2. **Pipeline npm** com Tailwind **v4** (`@tailwindcss/postcss` + `tailwindcss@4`), enquanto `src/index.css` usava diretivas da **v3** (`@tailwind base/components/utilities`).

Isso gerava build redundante, dependência de rede para estilização e incompatibilidade conceitual entre v3 e v4. Para publicação no **GitHub Pages** (repositório `Diario-Digital`), o Vite também precisava do `base` correto (`/Diario-Digital/`).

### Alterações realizadas

| Área | Antes | Depois |
|------|--------|--------|
| Tailwind (npm) | `tailwindcss@4.2.1` + `@tailwindcss/postcss` | `tailwindcss@3.4.17` |
| PostCSS | `@tailwindcss/postcss` | `tailwindcss` + `autoprefixer` (padrão v3) |
| `index.html` | Script CDN + estilos inline duplicados | HTML mínimo; estilos só via `src/index.css` |
| `vite.config.js` | `base` padrão (`/`) | `base: '/Diario-Digital/'` |
| `src/index.css` | Apenas `body` | Reset `box-sizing` + `html, body, #root` em altura 100% |

### Arquivos modificados

- `package.json` — remoção de `@tailwindcss/postcss`; Tailwind fixado em `^3.4.17`
- `package-lock.json` — lockfile atualizado após `npm install`
- `postcss.config.js` — plugins v3
- `vite.config.js` — `base` para GitHub Pages
- `index.html` — remoção do CDN e estilos inline
- `src/index.css` — estilos globais antes no HTML
- `tailwind.config.js` — **sem alteração** (já estava no formato v3)

### Como validar

```bash
npm install
npm run build
```

Critérios de aceite:

- [x] Build conclui sem erro.
- [x] `dist/index.html` **não** contém `cdn.tailwindcss.com`.
- [x] Assets em `dist/index.html` usam prefixo `/Diario-Digital/` (ex.: `/Diario-Digital/assets/...`).
- [x] CSS gerado ~15–16 kB (utilitários Tailwind compilados; antes ~6 kB sem purge completo + CDN).

Preview local simulando GitHub Pages:

```bash
npm run preview
```

Acessar a URL exibida no terminal (Vite preview respeita o `base`).

### Resultado do build (referência)

```
dist/index.html                   ~0,62 kB
dist/assets/index-*.css          ~15,76 kB
dist/assets/index-*.js           ~215 kB
```

### Pendências / riscos

- **Dev local:** `npm run dev` usa `base: '/Diario-Digital/'`; a URL de desenvolvimento pode ser `http://localhost:5173/Diario-Digital/` (comportamento esperado do Vite com `base` não raiz).
- **Fase 2:** workflow GitHub Actions e publicação da pasta `dist` ainda não configurados.
- **UI vs. relatórios:** validações, “Confirmar senha” e botão “Sugerir Categoria” continuam divergentes dos documentos da 5ª entrega — escopo da Fase 3.
- **`.gitignore`:** `node_modules/` ainda não ignorado no repositório — escopo da Fase 5.

### Referência acadêmica (para o relatório)

A Fase 1 estabelece um **pipeline de build único e reproduzível**, alinhado a boas práticas de SPAs estáticas: estilos compilados no build, sem CDN em produção, e caminho base explícito para hospedagem em subdiretório do GitHub Pages — requisito comum em projetos de extensão publicados no GitHub da instituição ou do aluno.
