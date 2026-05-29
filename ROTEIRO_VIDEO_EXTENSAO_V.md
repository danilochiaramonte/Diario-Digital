# Roteiro de Vídeo — Diário Digital (Extensão V)

**Duração alvo:** 8–10 minutos  
**Formato sugerido:** gravação de tela + narração em português

Substitua `<URL_DO_SITE>` pela URL publicada no GitHub Pages após o deploy.

---

## 1. Introdução (1 min)

- Apresentação: nome, curso (ADS), disciplina de extensão, projeto **Diário Digital**.
- Objetivo: app de anotações **offline-first**, sem back-end, dados no navegador.
- Mostrar a URL `<URL_DO_SITE>` no navegador.

## 2. Arquitetura rápida (1 min)

- Abrir repositório (opcional): React + Vite, pasta `src/logic`, `localStorage`.
- Mencionar deploy estático no **GitHub Pages** e PWA.

## 3. Cadastro e login (1,5 min)

- Tela de login → **Cadastre-se**.
- Cadastrar usuário novo com **confirmar senha**.
- Mostrar tela **“Cadastro concluído!”** → **Ir para o login**.
- Entrar com o usuário criado.
- (Opcional) Tentar login com senha errada → mensagem de erro na tela.

## 4. Notas — CRUD e busca (2,5 min)

- Home vazia → **Nova Nota**.
- Criar nota com título, conteúdo, categoria e tags.
- Voltar à home: nota listada.
- **Buscar** por palavra do título ou tag.
- Editar nota e salvar.
- Excluir com confirmação.

## 5. Recursos “inteligentes” (2 min)

- Nova/editar nota: texto com palavras como *comprar*, *pix*, *prova* ou *consulta*.
- Clicar **Sugerir Categoria** → categoria preenchida.
- Botão **Áudio para Texto** (Chrome): falar uma frase curta → texto no conteúdo.
- Mencionar que a categoria usa regras/IA simulada; voz usa API do navegador.

## 6. Offline e PWA (1 min)

- DevTools → Application → Service Worker / Manifest (opcional, rápido).
- Ou: menu do Chrome → **Instalar app** / adicionar à tela inicial.
- Recarregar offline (após ter aberto o site antes): app abre; notas permanecem.

## 7. Encerramento (1 min)

- Resumo: login, notas, busca, categorias, PWA, GitHub Pages.
- Agradecimento e referência aos documentos (`CHANGELOG_EXTENSAO_V.md`, testes).

---

## Checklist antes de gravar

- [ ] `npm run build` sem erros
- [ ] Site no ar em `<URL_DO_SITE>`
- [ ] Navegador em português (reconhecimento de voz)
- [ ] Limpar `localStorage` ou usar usuário de demonstração dedicado
- [ ] Fechar abas e notificações desnecessárias
