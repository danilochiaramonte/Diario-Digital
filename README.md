# Diário Digital

Aplicativo web de anotações pessoais, desenvolvido como projeto de extensão/TCC (ADS — UniFil). Arquitetura **offline-first** com React, Vite e persistência em `localStorage`.

## Funcionalidades

- Cadastro e login de usuários
- CRUD de notas (título, conteúdo, categoria, tags)
- Busca por palavra-chave
- Sugestão de categoria (regras + palavras-chave)
- Áudio para texto (Web Speech API — Chrome)
- PWA instalável com cache offline do app

## Requisitos

- Node.js 18+
- npm

## Desenvolvimento

```bash
npm install
npm run dev
```

URL local (com `base` do GitHub Pages): `http://localhost:5173/Diario-Digital/`

## Build e preview

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

1. Push na branch `main`
2. Repositório → **Settings → Pages → Source: GitHub Actions**
3. Site: `https://<usuario>.github.io/Diario-Digital/`

Detalhes em [DEPLOYMENT.md](./DEPLOYMENT.md).

## Documentação do projeto

| Arquivo | Conteúdo |
|---------|----------|
| [CHANGELOG_EXTENSAO_V.md](./CHANGELOG_EXTENSAO_V.md) | Histórico técnico por fase (matéria-prima do relatório) |
| [implementation_summary.md](./implementation_summary.md) | Resumo da implementação — Extensão V |
| [functional_tests.md](./functional_tests.md) | Cenários de teste TU/TA |
| [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) | Checklist manual para validação |
| [ROTEIRO_VIDEO_EXTENSAO_V.md](./ROTEIRO_VIDEO_EXTENSAO_V.md) | Roteiro do vídeo de demonstração (~10 min) |

## Estrutura

```
src/
  App.jsx              # Interface React
  logic/               # Domínio (User, Note, managers, StorageManager)
public/
dist/                  # Build de produção (gerado)
```

## Licença

Projeto acadêmico — uso conforme orientação da disciplina.
